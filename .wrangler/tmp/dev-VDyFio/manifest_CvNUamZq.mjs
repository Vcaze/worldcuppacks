globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as decodeKey } from './chunks/astro/server_BWllRMbt.mjs';
import './chunks/astro-designed-error-pages_CypUBhpt.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_BjMuF2U8.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/","cacheDir":"file:///mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/node_modules/.astro/","outDir":"file:///mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/dist/","srcDir":"file:///mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/src/","publicDir":"file:///mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/public/","buildClientDir":"file:///mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/dist/","buildServerDir":"file:///mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/_slug_.BvBroqmu.css"},{"type":"inline","content":"@keyframes scanMask{0%{-webkit-mask-position:0% 200%;mask-position:0% 200%}to{-webkit-mask-position:0% -100%;mask-position:0% -100%}}img[src*=\"12d367_71ebdd7141d041e4be3d91d80d4578dd\"]{-webkit-mask-image:linear-gradient(to bottom,transparent 0%,rgba(255,255,255,1) 50%,transparent 100%);mask-image:linear-gradient(to bottom,transparent 0%,rgba(255,255,255,1) 50%,transparent 100%);-webkit-mask-size:100% 200%;mask-size:100% 200%;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;animation:scanMask 2s linear infinite}:where([style*=--img-aspect-ratio]){aspect-ratio:var(--img-aspect-ratio)}:where([style*=--img-default-width]){width:var(--img-default-width);max-width:100%}\n"}],"routeData":{"route":"/[...slug]","isIndex":false,"type":"page","pattern":"^(?:\\/(.*?))?\\/?$","segments":[[{"content":"...slug","dynamic":true,"spread":true}]],"params":["...slug"],"component":"src/pages/[...slug].astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/src/pages/[...slug].astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/[...slug]@_@astro":"pages/_---slug_.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_CvNUamZq.mjs","/mnt/c/xampp/htdocs/vinr/extra/worldcuppacks/node_modules/unstorage/drivers/cloudflare-kv-binding.mjs":"chunks/cloudflare-kv-binding_DMly_2Gl.mjs","@/components/Router":"_astro/Router.C7LEjolV.js","@astrojs/react/client.js":"_astro/client.DmcNSNmg.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/w8gdH283Tvk__Lua32TysjIfqMuPLdshZhVB.CbtmXMq4.woff2","/_astro/w8gdH283Tvk__Lua32TysjIfqcuPLdshZhVB.DwWHui5t.woff2","/_astro/w8gdH283Tvk__Lua32TysjIfpcuPLdshZhVB.BmEeayug.woff2","/_astro/w8gdH283Tvk__Lua32TysjIfp8uPLdshZg.zd9snEGF.woff2","/_astro/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.C9TeKmec.woff2","/_astro/6xKtdSZaM9iE8KbpRA_hJVQNYuDyP7bh.C-6CJIFn.woff2","/_astro/6xKtdSZaM9iE8KbpRA_hJFQNYuDyP7bh.BHkeTvmg.woff2","/_astro/_slug_.BvBroqmu.css","/error.svg","/fakeenv.js","/_astro/Router.C7LEjolV.js","/_astro/client.DmcNSNmg.js","/_astro/index.DzyC4ibv.js","/flags/algeria.png","/flags/argentina.png","/flags/australia.png","/flags/austria.png","/flags/belgium.png","/flags/bolivia.png","/flags/brazil.png","/flags/canada.png","/flags/cape_verde.png","/flags/colombia.png","/flags/croatia.png","/flags/curacao.png","/flags/denmark.png","/flags/ecuador.png","/flags/egypt.png","/flags/england.png","/flags/france.png","/flags/germany.png","/flags/ghana.png","/flags/haiti.png","/flags/iran.png","/flags/italy.png","/flags/ivory_coast.png","/flags/jamaica.png","/flags/japan.png","/flags/jordan.png","/flags/mexico.png","/flags/morocco.png","/flags/netherlands.png","/flags/new_zealand.png","/flags/norway.png","/flags/panama.png","/flags/paraguay.png","/flags/portugal.png","/flags/qatar.png","/flags/saudi_arabia.png","/flags/scotland.png","/flags/senegal.png","/flags/south_africa.png","/flags/south_korea.png","/flags/spain.png","/flags/sweden.png","/flags/switzerland.png","/flags/tunisia.png","/flags/turkey.png","/flags/uruguay.png","/flags/usa.png","/flags/uzbekistan.png","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/noop-entrypoint.mjs","/_worker.js/renderers.mjs","/_worker.js/chunks/_@astro-renderers_yfibakJW.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_CGQSbvKw.mjs","/_worker.js/chunks/astro-designed-error-pages_CypUBhpt.mjs","/_worker.js/chunks/astro_ZlGB-oU-.mjs","/_worker.js/chunks/cloudflare-kv-binding_DMly_2Gl.mjs","/_worker.js/chunks/index_B45zuQT8.mjs","/_worker.js/chunks/noop-middleware_BjMuF2U8.mjs","/_worker.js/_astro/6xKtdSZaM9iE8KbpRA_hJFQNYuDyP7bh.BHkeTvmg.woff2","/_worker.js/_astro/6xKtdSZaM9iE8KbpRA_hJVQNYuDyP7bh.C-6CJIFn.woff2","/_worker.js/_astro/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.C9TeKmec.woff2","/_worker.js/_astro/_slug_.BvBroqmu.css","/_worker.js/_astro/w8gdH283Tvk__Lua32TysjIfp8uPLdshZg.zd9snEGF.woff2","/_worker.js/_astro/w8gdH283Tvk__Lua32TysjIfpcuPLdshZhVB.BmEeayug.woff2","/_worker.js/_astro/w8gdH283Tvk__Lua32TysjIfqMuPLdshZhVB.CbtmXMq4.woff2","/_worker.js/_astro/w8gdH283Tvk__Lua32TysjIfqcuPLdshZhVB.DwWHui5t.woff2","/_worker.js/pages/_---slug_.astro.mjs","/_worker.js/pages/_image.astro.mjs","/fonts/varelaround/v21/w8gdH283Tvk__Lua32TysjIfp8uPLdshZg.woff2","/fonts/varelaround/v21/w8gdH283Tvk__Lua32TysjIfpcuPLdshZhVB.woff2","/fonts/varelaround/v21/w8gdH283Tvk__Lua32TysjIfqMuPLdshZhVB.woff2","/fonts/varelaround/v21/w8gdH283Tvk__Lua32TysjIfqcuPLdshZhVB.woff2","/fonts/quicksand/v37/6xKtdSZaM9iE8KbpRA_hJFQNYuDyP7bh.woff2","/fonts/quicksand/v37/6xKtdSZaM9iE8KbpRA_hJVQNYuDyP7bh.woff2","/fonts/quicksand/v37/6xKtdSZaM9iE8KbpRA_hK1QNYuDyPw.woff2","/_worker.js/chunks/astro/server_BWllRMbt.mjs"],"buildFormat":"directory","checkOrigin":false,"allowedDomains":[],"actionBodySizeLimit":1048576,"serverIslandNameMap":[],"key":"xR1sCjmuUn8dMd3C5sxfyNlQgZ9mMLtOnnEQIvduOeI=","sessionConfig":{"driver":"cloudflare-kv-binding","options":{"binding":"SESSION"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/cloudflare-kv-binding_DMly_2Gl.mjs');

export { manifest };
