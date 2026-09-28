const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const script = fs.readFileSync(path.join(root, "assets/js/hero-video.js"), "utf8");

function createMediaQuery(matches) {
    return {
        matches,
        addEventListener(event, handler) { this.onChange = handler; },
        change(matches) { this.matches = matches; this.onChange(); }
    };
}

function loadHero({ mobile = false, reducedMotion = false, saveData = false,
    hasConnection = true, rejectPlayback = false } = {}) {
    const mobileQuery = createMediaQuery(mobile);
    const motionQuery = createMediaQuery(reducedMotion);
    const sources = [];
    const attributes = new Map();
    const events = {};
    const video = {
        dataset: { mobileSrc: "mobile.mp4", desktopSrc: "light.mp4" },
        hidden: true,
        addEventListener(event, handler) { events[event] = handler; },
        pauseCount: 0,
        loadCount: 0,
        getAttribute(name) { return attributes.get(name); },
        hasAttribute(name) { return attributes.has(name); },
        removeAttribute(name) { attributes.delete(name); },
        set src(value) { attributes.set("src", value); sources.push(value); },
        pause() { this.pauseCount++; },
        load() { this.loadCount++; },
        play() { return rejectPlayback ? Promise.reject(new Error("Autoplay blocked")) : Promise.resolve(); }
    };
    const connection = hasConnection ? {
        saveData,
        addEventListener(event, handler) { this.onChange = handler; }
    } : undefined;
    vm.runInNewContext(script, {
        document: { querySelector: () => video },
        window: { matchMedia: query => query === "(max-width: 680px)" ? mobileQuery : motionQuery },
        navigator: { connection }
    });
    return { video, sources, mobileQuery, motionQuery, connection, events };
}

test("selects only the initial desktop or mobile video", () => {
    assert.deepEqual(loadHero().sources, ["light.mp4"]);
    assert.deepEqual(loadHero({ mobile: true }).sources, ["mobile.mp4"]);
});

test("changes source only when the selected size changes", () => {
    const hero = loadHero();
    hero.mobileQuery.change(false);
    hero.mobileQuery.change(true);
    hero.mobileQuery.change(true);
    assert.deepEqual(hero.sources, ["light.mp4", "mobile.mp4"]);
});

test("requests no video for reduced motion or data saving", () => {
    assert.deepEqual(loadHero({ reducedMotion: true }).sources, []);
    assert.deepEqual(loadHero({ saveData: true }).sources, []);
});

test("reduced motion releases video and resuming uses the current viewport", () => {
    const hero = loadHero();
    hero.events.playing();
    hero.motionQuery.change(true);
    assert.equal(hero.video.hidden, true);
    assert.equal(hero.video.hasAttribute("src"), false);
    assert.equal(hero.video.pauseCount, 1);
    assert.equal(hero.video.loadCount, 1);
    hero.mobileQuery.change(true);
    assert.deepEqual(hero.sources, ["light.mp4"]);
    hero.motionQuery.change(false);
    assert.deepEqual(hero.sources, ["light.mp4", "mobile.mp4"]);
});

test("responds to data-saving changes without requiring the connection API", () => {
    const hero = loadHero();
    hero.connection.saveData = true;
    hero.connection.onChange();
    assert.equal(hero.video.hasAttribute("src"), false);
    hero.connection.saveData = false;
    hero.connection.onChange();
    assert.deepEqual(hero.sources, ["light.mp4", "light.mp4"]);
    assert.deepEqual(loadHero({ hasConnection: false }).sources, ["light.mp4"]);
});

test("handles rejected autoplay without an unhandled rejection", async () => {
    const hero = loadHero({ rejectPlayback: true });
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(hero.video.hidden, true);
});

test("keeps the preview visible until playback and restores it on failure", () => {
    const hero = loadHero();
    assert.equal(hero.video.hidden, true);
    hero.events.playing();
    assert.equal(hero.video.hidden, false);
    hero.mobileQuery.change(true);
    assert.equal(hero.video.hidden, true);
    hero.events.playing();
    hero.events.error();
    assert.equal(hero.video.hidden, true);
});

test("does nothing on pages without a hero video", () => {
    assert.doesNotThrow(() => vm.runInNewContext(script, {
        document: { querySelector: () => null }
    }));
});

for (const filename of ["index.html", "bay-area-wedding-photo-booth.html"]) {
    test(`${filename} provides a poster and defers video URLs to the early loader`, () => {
        const html = fs.readFileSync(path.join(root, filename), "utf8");
        const markup = html.match(/<video\b[^>]*data-hero-video[^>]*>/)?.[0];
        assert.ok(markup);
        assert.doesNotMatch(markup, /\ssrc=/);
        assert.match(markup, /\shidden\s/);
        for (const attribute of ["data-desktop-src", "data-mobile-src"]) {
            const asset = markup.match(new RegExp(`\\s${attribute}="([^"]+)"`))?.[1];
            assert.ok(asset && fs.existsSync(path.join(root, asset)), attribute);
        }
        assert.match(html, /<script async src="\.\/assets\/js\/hero-video\.js"><\/script>/);
        assert.match(html, /<source media="\(max-width: 680px\)" srcset="\.\/assets\/images\/hero-poster-mobile\.jpg"/);
        for (const [poster, media] of [["hero-poster.jpg", "not all and (max-width: 680px)"], ["hero-poster-mobile.jpg", "(max-width: 680px)"]]) {
            assert.ok(fs.existsSync(path.join(root, "assets/images", poster)));
            assert.ok(html.includes(`<link rel="preload" as="image" href="./assets/images/${poster}" media="${media}" fetchpriority="high" />`));
        }
    });
}