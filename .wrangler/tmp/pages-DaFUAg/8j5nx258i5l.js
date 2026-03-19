// <define:__ROUTES__>
var define_ROUTES_default = {
  version: 1,
  include: [
    "/*"
  ],
  exclude: [
    "/_astro/*",
    "/error.svg",
    "/fakeenv.js",
    "/flags/algeria.png",
    "/flags/argentina.png",
    "/flags/australia.png",
    "/flags/austria.png",
    "/flags/belgium.png",
    "/flags/bolivia.png",
    "/flags/brazil.png",
    "/flags/canada.png",
    "/flags/cape_verde.png",
    "/flags/colombia.png",
    "/flags/croatia.png",
    "/flags/curacao.png",
    "/flags/denmark.png",
    "/flags/ecuador.png",
    "/flags/egypt.png",
    "/flags/england.png",
    "/flags/france.png",
    "/flags/germany.png",
    "/flags/ghana.png",
    "/flags/haiti.png",
    "/flags/iran.png",
    "/flags/italy.png",
    "/flags/ivory_coast.png",
    "/flags/jamaica.png",
    "/flags/japan.png",
    "/flags/jordan.png",
    "/flags/mexico.png",
    "/flags/morocco.png",
    "/flags/netherlands.png",
    "/flags/new_zealand.png",
    "/flags/norway.png",
    "/flags/panama.png",
    "/flags/paraguay.png",
    "/flags/portugal.png",
    "/flags/qatar.png",
    "/flags/saudi_arabia.png",
    "/flags/scotland.png",
    "/flags/senegal.png",
    "/flags/south_africa.png",
    "/flags/south_korea.png",
    "/flags/spain.png",
    "/flags/sweden.png",
    "/flags/switzerland.png",
    "/flags/tunisia.png",
    "/flags/turkey.png",
    "/flags/uruguay.png",
    "/flags/usa.png",
    "/flags/uzbekistan.png",
    "/fonts/varelaround/v21/w8gdH283Tvk__Lua32TysjIfp8uPLdshZg.woff2",
    "/fonts/varelaround/v21/w8gdH283Tvk__Lua32TysjIfpcuPLdshZhVB.woff2",
    "/fonts/varelaround/v21/w8gdH283Tvk__Lua32TysjIfqMuPLdshZhVB.woff2",
    "/fonts/varelaround/v21/w8gdH283Tvk__Lua32TysjIfqcuPLdshZhVB.woff2",
    "/fonts/quicksand/v37/6xKtdSZaM9iE8KbpRA_hJFQNYuDyP7bh.woff2",
    "/fonts/quicksand/v37/6xKtdSZaM9iE8KbpRA_hJVQNYuDyP7bh.woff2",
    "/fonts/quicksand/v37/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.woff2"
  ]
};

// node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/.wrangler/tmp/pages-DaFUAg/bundledWorker-0.16615768301108358.mjs";
import { isRoutingRuleMatch } from "/mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/.wrangler/tmp/pages-DaFUAg/bundledWorker-0.16615768301108358.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
  fetch(request, env, context) {
    const { pathname } = new URL(request.url);
    for (const exclude of routes.exclude) {
      if (isRoutingRuleMatch(pathname, exclude)) {
        return env.ASSETS.fetch(request);
      }
    }
    for (const include of routes.include) {
      if (isRoutingRuleMatch(pathname, include)) {
        const workerAsHandler = worker;
        if (workerAsHandler.fetch === void 0) {
          throw new TypeError("Entry point missing `fetch` handler");
        }
        return workerAsHandler.fetch(request, env, context);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
export {
  pages_dev_pipeline_default as default
};
//# sourceMappingURL=8j5nx258i5l.js.map
