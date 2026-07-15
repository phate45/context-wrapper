import{join as Me,dirname as Fe,resolve as J}from"node:path";import{tmpdir as Ut}from"node:os";import{mkdtempSync as $t,readFileSync as Bt,rmSync as jt}from"node:fs";import{randomBytes as Ht}from"node:crypto";import{fileURLToPath as Wt}from"node:url";import{Server as Xt}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as Vt}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as Yt}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as qt}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as Gt,CallToolRequestSchema as zt}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as G,readdirSync as xt,statSync as xe,mkdirSync as vt}from"node:fs";import{execSync as Dt}from"node:child_process";import{join as z,dirname as Nt,basename as ve,resolve as M,relative as Ct}from"node:path";import{createRequire as We}from"node:module";import{existsSync as Xe,unlinkSync as ne,renameSync as an}from"node:fs";var H=class{#e;constructor(e){this.#e=e}pragma(e){let n=this.#e.prepare(`PRAGMA ${e}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let s=Object.values(n[0]);return s.length===1?s[0]:n[0]}exec(e){let t="",n=null;for(let i=0;i<e.length;i++){let o=e[i];if(n)t+=o,o===n&&(n=null);else if(o==="'"||o==='"')t+=o,n=o;else if(o===";"){let a=t.trim();a&&this.#e.prepare(a).run(),t=""}else t+=o}let s=t.trim();return s&&this.#e.prepare(s).run(),this}prepare(e){let t=this.#e.prepare(e);return{run:(...n)=>t.run(...n),get:(...n)=>{let s=t.get(...n);return s===null?void 0:s},all:(...n)=>t.all(...n),iterate:(...n)=>t.iterate(...n)}}transaction(e){return this.#e.transaction(e)}close(){this.#e.close()}},W=class{#e;constructor(e){this.#e=e}pragma(e){let n=this.#e.prepare(`PRAGMA ${e}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let s=Object.values(n[0]);return s.length===1?s[0]:n[0]}exec(e){return this.#e.exec(e),this}prepare(e){let t=this.#e.prepare(e);return{run:(...n)=>t.run(...n),get:(...n)=>t.get(...n),all:(...n)=>t.all(...n),iterate:(...n)=>typeof t.iterate=="function"?t.iterate(...n):t.all(...n)[Symbol.iterator]()}}transaction(e){return(...t)=>{this.#e.exec("BEGIN");try{let n=e(...t);return this.#e.exec("COMMIT"),n}catch(n){throw this.#e.exec("ROLLBACK"),n}}}close(){this.#e.close()}},O=null;function Ve(r){let e=null;try{return e=new r(":memory:"),e.exec("CREATE VIRTUAL TABLE __fts5_probe USING fts5(x)"),!0}catch{return!1}finally{try{e?.close()}catch{}}}function Ye(r,e){let t=e!==void 0?e:globalThis.Bun;if(typeof t<"u"&&t!==null)return!0;let n=r??process.versions,[s,i]=(n.node??"0.0.0").split("."),o=Number(s),a=Number(i);return!Number.isFinite(o)||!Number.isFinite(a)?!1:o>22||o===22&&a>=5}function re(){if(!O){let r=We(import.meta.url);if(globalThis.Bun){let e=r(["bun","sqlite"].join(":")).Database;O=function(n,s){let i=new e(n,{readonly:s?.readonly,create:!0}),o=new H(i);return s?.timeout&&o.pragma(`busy_timeout = ${s.timeout}`),o}}else if(Ye()){let e=null;try{({DatabaseSync:e}=r(["node","sqlite"].join(":")))}catch{e=null}e&&Ve(e)?O=function(n,s){let i=new e(n,{readOnly:s?.readonly??!1}),o=new W(i);return s?.timeout&&o.pragma(`busy_timeout = ${s.timeout}`),o}:O=r("better-sqlite3")}else O=r("better-sqlite3")}return O}function X(r){r.pragma("journal_mode = WAL"),r.pragma("synchronous = NORMAL");try{r.pragma("mmap_size = 268435456")}catch{}}function V(r){if(!Xe(r))for(let e of["-wal","-shm"])try{ne(r+e)}catch{}}function se(r){for(let e of["","-wal","-shm"])try{ne(r+e)}catch{}}function Y(r){try{r.pragma("wal_checkpoint(TRUNCATE)")}catch{}try{r.close()}catch{}}function w(r,e=[100,500,2e3]){let t;for(let n=0;n<=e.length;n++)try{return r()}catch(s){let i=s instanceof Error?s.message:String(s);if(!i.includes("SQLITE_BUSY")&&!i.includes("database is locked"))throw s;if(t=s instanceof Error?s:new Error(i),n<e.length){let o=e[n],a=Date.now();for(;Date.now()-a<o;);}}throw new Error(`SQLITE_BUSY: database is locked after ${e.length} retries. Original error: ${t?.message}`)}function ie(r){return r.includes("SQLITE_CORRUPT")||r.includes("SQLITE_NOTADB")||r.includes("database disk image is malformed")||r.includes("file is not a database")}var F=Symbol.for("__context_mode_live_dbs_v3__"),cn=(()=>{let r=globalThis;return r[F]||(r[F]=new Set,process.on("exit",()=>{for(let e of r[F])Y(e);r[F].clear()})),r[F]})();import{readFileSync as de,readdirSync as mn,unlinkSync as ct,existsSync as ut,statSync as he,openSync as ge,fstatSync as pe,closeSync as me}from"node:fs";import{createHash as fe}from"node:crypto";import{tmpdir as lt}from"node:os";import{join as dt}from"node:path";import{readdirSync as qe,statSync as Ge,lstatSync as ze,realpathSync as oe,existsSync as Ke,readFileSync as Je}from"node:fs";import{join as ce,extname as Qe,relative as ue,sep as Ze,resolve as et}from"node:path";var tt=["node_modules",".git","dist","build",".next","coverage",".venv","__pycache__",".DS_Store"],nt=[".md",".mdx",".txt",".json",".yaml",".yml",".ts",".tsx",".js",".jsx",".py",".rs",".go",".sh"],rt=5,st=200;function it(r){let e="";for(let t=0;t<r.length;t++){let n=r[t];n==="*"?r[t+1]==="*"?(e+=".*",t++):e+="[^/]*":n==="?"?e+="[^/]":"\\^$.|+()[]{}".includes(n)?e+="\\"+n:e+=n}return new RegExp(`^${e}$`)}function ae(r,e){if(e.length===0)return!1;let t=r.split("/").pop()??r;for(let n of e){if(!n.includes("/")&&!n.includes("*")){if(t===n||r.split("/").includes(n))return!0;continue}let s=it(n);if(s.test(r)||s.test(t))return!0}return!1}function ot(r){let e=ce(r,".gitignore");if(!Ke(e))return[];try{return Je(e,"utf-8").split(/\r?\n/).map(n=>n.trim()).filter(n=>n.length>0&&!n.startsWith("#")&&!n.startsWith("!")).map(n=>n.replace(/^\//,"").replace(/\/$/,""))}catch{return[]}}function at(r,e){return ue(r,e).split(Ze).join("/")}function le(r,e={}){let{include:t,exclude:n,maxDepth:s=rt,maxFiles:i=st,extensions:o,respectGitignore:a=!0,followSymlinks:u=!1}=e,c;try{c=oe(r)}catch{return{files:[],capped:!1,totalSeen:0}}let l=(o&&o.length>0?o:nt).map(f=>(f.startsWith(".")?f:"."+f).toLowerCase()),h=[...tt,...n??[],...a?ot(c):[]],d=t??[],g=[],p=new Set([c]),E=0,m=!1;function _(f,D){if(m||D>s)return;let C;try{C=qe(f,{withFileTypes:!0})}catch{return}for(let A of C){if(m)return;let S=ce(f,A.name),y=at(c,S);if(ae(y,h))continue;let L=A.isDirectory(),R=A.isFile(),N=!1;try{N=ze(S).isSymbolicLink()}catch{continue}if(N){if(!u)continue;let T;try{T=oe(S)}catch{continue}let k=ue(c,T);if((k.startsWith("..")||et(k)===T)&&k.startsWith("..")||p.has(T))continue;p.add(T);try{let v=Ge(T);L=v.isDirectory(),R=v.isFile()}catch{continue}}if(L){_(S,D+1);continue}if(!R)continue;let b=Qe(S).toLowerCase();if(l.includes(b)&&!(d.length>0&&!ae(y,d))){if(E++,g.length>=i){m=!0;return}g.push(S)}}}return _(c,0),{files:g,capped:m,totalSeen:E}}var I=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function _e(r){let e=new Set,t=[];for(let n of r){let s=n.toLowerCase();e.has(s)||(e.add(s),t.push(n))}return t}function ht(r,e="AND"){let t=_e(r.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(i=>i.length>0&&!["AND","OR","NOT","NEAR"].includes(i.toUpperCase())));if(t.length===0)return'""';let n=t.filter(i=>!I.has(i.toLowerCase()));return(n.length>0?n:t).map(i=>`"${i}"`).join(e==="OR"?" OR ":" ")}function gt(r,e="AND"){let t=r.replace(/["'(){}[\]*:^~]/g,"").trim();if(t.length<3)return"";let n=_e(t.split(/\s+/).filter(o=>o.length>=3));if(n.length===0)return"";let s=n.filter(o=>!I.has(o.toLowerCase()));return(s.length>0?s:n).map(o=>`"${o}"`).join(e==="OR"?" OR ":" ")}function pt(r,e){if(r.length===0)return e.length;if(e.length===0)return r.length;let t=Array.from({length:e.length+1},(n,s)=>s);for(let n=1;n<=r.length;n++){let s=[n];for(let i=1;i<=e.length;i++)s[i]=r[n-1]===e[i-1]?t[i-1]:1+Math.min(t[i],s[i-1],t[i-1]);t=s}return t[e.length]}function mt(r){return r<=4?1:r<=12?2:3}var $=4096,ft=3,Et=200,_t=5e3,Ee=80,yt=.5;function St(r,e){let t=[],n=r.indexOf(e);for(;n!==-1;)t.push(n),n=r.indexOf(e,n+1);return t}function bt(r,e,t=30){if(r.length<2||e.length<2)return 0;let n=0,s=Math.min(r.length,e.length)-1;for(let i=0;i<s;i++){let o=r[i],a=r[i+1],u=e[i].length,c=0;for(let l of o){let h=l+u,d=h+t;for(;c<a.length&&a[c]<h;)c++;c<a.length&&a[c]<=d&&(n++,c++)}}return n}function Tt(r){if(r.length===0)return 1/0;if(r.length===1)return 0;let e=r,t=new Array(e.length).fill(0),n=1/0;for(;;){let s=1/0,i=-1/0,o=0;for(let u=0;u<e.length;u++){let c=e[u][t[u]];c<s&&(s=c,o=u),c>i&&(i=c)}let a=i-s;if(a<n&&(n=a),t[o]++,t[o]>=e[o].length)break}return n}var B=class r{#e;#n;#i;#a;#c;#u;#l;#d;#h;#g;#p;#m;#f;#E;#_;#y;#S;#b;#T;#R;#k;#x;#v;#D;#N;#C;#A;#L;#O;#w;#I;#M;#F;#P=0;static OPTIMIZE_EVERY=50;#t=new Map;static FUZZY_CACHE_SIZE=256;constructor(e){let t=re();this.#n=e??dt(lt(),`context-mode-${process.pid}.db`),V(this.#n);let n;try{n=new t(this.#n,{timeout:3e4}),X(n)}catch(s){let i=s instanceof Error?s.message:String(s);if(ie(i)){se(this.#n),V(this.#n);try{n=new t(this.#n,{timeout:3e4}),X(n)}catch(o){throw new Error(`Failed to create fresh DB after deleting corrupt file: ${o instanceof Error?o.message:String(o)}`)}}else throw s}this.#e=n,this.#W(),this.#X()}cleanup(){try{this.#e.close()}catch{}for(let e of["","-wal","-shm"])try{ct(this.#n+e)}catch{}}#W(){this.#e.exec(`
      CREATE TABLE IF NOT EXISTS sources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        label TEXT NOT NULL,
        chunk_count INTEGER NOT NULL DEFAULT 0,
        code_chunk_count INTEGER NOT NULL DEFAULT 0,
        indexed_at TEXT NOT NULL DEFAULT (datetime('now')),
        file_path TEXT,
        content_hash TEXT
      );

      CREATE VIRTUAL TABLE IF NOT EXISTS chunks USING fts5(
        title,
        content,
        source_id UNINDEXED,
        content_type UNINDEXED,
        source_category UNINDEXED,
        session_id UNINDEXED,
        event_id UNINDEXED,
        timestamp UNINDEXED,
        tokenize='porter unicode61'
      );

      CREATE VIRTUAL TABLE IF NOT EXISTS chunks_trigram USING fts5(
        title,
        content,
        source_id UNINDEXED,
        content_type UNINDEXED,
        source_category UNINDEXED,
        session_id UNINDEXED,
        event_id UNINDEXED,
        timestamp UNINDEXED,
        tokenize='trigram'
      );

      CREATE TABLE IF NOT EXISTS vocabulary (
        word TEXT PRIMARY KEY
      );

      CREATE INDEX IF NOT EXISTS idx_sources_label ON sources(label);
    `);try{let e=this.#e.prepare("SELECT name FROM pragma_table_xinfo('chunks')").all(),t=new Set(e.map(n=>n.name));e.length>0&&!t.has("source_category")&&(this.#e.exec("DROP TABLE IF EXISTS chunks"),this.#e.exec("DROP TABLE IF EXISTS chunks_trigram"),this.#e.exec(`
          CREATE VIRTUAL TABLE chunks USING fts5(
            title,
            content,
            source_id UNINDEXED,
            content_type UNINDEXED,
            source_category UNINDEXED,
            session_id UNINDEXED,
            event_id UNINDEXED,
            timestamp UNINDEXED,
            tokenize='porter unicode61'
          );
          CREATE VIRTUAL TABLE chunks_trigram USING fts5(
            title,
            content,
            source_id UNINDEXED,
            content_type UNINDEXED,
            source_category UNINDEXED,
            session_id UNINDEXED,
            event_id UNINDEXED,
            timestamp UNINDEXED,
            tokenize='trigram'
          );
        `))}catch{}try{this.#e.exec("ALTER TABLE sources ADD COLUMN file_path TEXT")}catch{}try{this.#e.exec("ALTER TABLE sources ADD COLUMN content_hash TEXT")}catch{}}#X(){this.#a=this.#e.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, 0, 0, ?, ?)"),this.#c=this.#e.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, ?, ?, ?, ?)"),this.#u=this.#e.prepare("INSERT INTO chunks (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#l=this.#e.prepare("INSERT INTO chunks_trigram (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#d=this.#e.prepare("INSERT OR IGNORE INTO vocabulary (word) VALUES (?)"),this.#h=this.#e.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#g=this.#e.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#p=this.#e.prepare("DELETE FROM sources WHERE label = ?"),this.#m=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ?
      ORDER BY rank
      LIMIT ?
    `),this.#f=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label LIKE ? ESCAPE '\\'
      ORDER BY rank
      LIMIT ?
    `),this.#E=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label = ?
      ORDER BY rank
      LIMIT ?
    `),this.#_=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ?
      ORDER BY rank
      LIMIT ?
    `),this.#y=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label LIKE ? ESCAPE '\\'
      ORDER BY rank
      LIMIT ?
    `),this.#S=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label = ?
      ORDER BY rank
      LIMIT ?
    `),this.#T=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#R=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label LIKE ? ESCAPE '\\' AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#k=this.#e.prepare(`
      SELECT
        chunks.title,
        chunks.content,
        chunks.content_type,
        chunks.timestamp,
        sources.label,
        bm25(chunks, 5.0, 1.0) AS rank,
        highlight(chunks, 1, char(2), char(3)) AS highlighted,
        chunks.session_id
      FROM chunks
      JOIN sources ON sources.id = chunks.source_id
      WHERE chunks MATCH ? AND sources.label = ? AND chunks.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#x=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#v=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label LIKE ? ESCAPE '\\' AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#D=this.#e.prepare(`
      SELECT
        chunks_trigram.title,
        chunks_trigram.content,
        chunks_trigram.content_type,
        chunks_trigram.timestamp,
        sources.label,
        bm25(chunks_trigram, 5.0, 1.0) AS rank,
        highlight(chunks_trigram, 1, char(2), char(3)) AS highlighted,
        chunks_trigram.session_id
      FROM chunks_trigram
      JOIN sources ON sources.id = chunks_trigram.source_id
      WHERE chunks_trigram MATCH ? AND sources.label = ? AND chunks_trigram.content_type = ?
      ORDER BY rank
      LIMIT ?
    `),this.#b=this.#e.prepare("SELECT word FROM vocabulary WHERE length(word) BETWEEN ? AND ?"),this.#N=this.#e.prepare("SELECT label, chunk_count as chunkCount FROM sources ORDER BY id DESC"),this.#C=this.#e.prepare(`SELECT c.title, c.content, c.content_type, s.label
       FROM chunks c
       JOIN sources s ON s.id = c.source_id
       WHERE c.source_id = ?
       ORDER BY c.rowid`),this.#A=this.#e.prepare("SELECT chunk_count FROM sources WHERE id = ?"),this.#L=this.#e.prepare("SELECT content FROM chunks WHERE source_id = ?"),this.#w=this.#e.prepare("SELECT label, chunk_count, code_chunk_count, indexed_at, file_path, content_hash FROM sources WHERE label = ?"),this.#O=this.#e.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sources) AS sources,
        (SELECT COUNT(*) FROM chunks) AS chunks,
        (SELECT COUNT(*) FROM chunks WHERE content_type = 'code') AS codeChunks
    `),this.#I=this.#e.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#M=this.#e.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#F=this.#e.prepare("DELETE FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days')")}setDenyChecker(e){this.#i=e}index(e){let{content:t,path:n,source:s,attribution:i}=e,o=typeof t=="string"&&t.length>0;if(!o&&!n)throw new Error("Either content or path must be provided");let a;if(o)a=t;else{let d=ge(n,"r");try{if(!pe(d).isFile())throw new Error(`refusing to index ${n}: not a regular file`);a=de(d,"utf-8")}finally{me(d)}}let u=s??n??"untitled",c=this.#G(a),l=n??void 0,h=l?fe("sha256").update(a).digest("hex"):void 0;return w(()=>this.#r(c,u,a,l,h,i))}indexDirectory(e){let{path:t,source:n,attribution:s,perFileDeny:i,...o}=e,a=le(t,o),u=0,c=0,l=0,h=0;for(let d of a.files){if(i&&i(d)){l++;continue}try{let g=n?`${n}:${d}`:d,p=this.index({path:d,source:g,attribution:s});u++,c+=p.totalChunks}catch{h++}}return{filesIndexed:u,totalChunks:c,capped:a.capped,totalSeen:a.totalSeen,denied:l,failed:h,label:n??t}}indexPlainText(e,t,n=20,s,i=$){if(!e||e.trim().length===0)return this.#r([],t,"",void 0,void 0,s);let o=this.#K(e,n,i);return w(()=>this.#r(o.map(a=>({...a,hasCode:!1})),t,e,void 0,void 0,s))}indexJSON(e,t,n=$,s){if(!e||e.trim().length===0)return this.indexPlainText("",t,void 0,s,n);let i;try{i=JSON.parse(e)}catch{return this.indexPlainText(e,t,void 0,s,n)}let o=[];return this.#H(i,[],o,n),o.length===0?this.indexPlainText(e,t,void 0,s,n):w(()=>this.#r(o,t,e,void 0,void 0,s))}#r(e,t,n,s,i,o){let a=e.filter(d=>d.hasCode).length,u=o?.sessionId??"",c=o?.eventId??"",h=this.#e.transaction(()=>{if(this.#h.run(t),this.#g.run(t),this.#p.run(t),e.length===0){let E=this.#a.run(t,s??null,i??null);return Number(E.lastInsertRowid)}let d=this.#c.run(t,e.length,a,s??null,i??null),g=Number(d.lastInsertRowid),p=new Date().toISOString();for(let E of e){let m=E.hasCode?"code":"prose";this.#u.run(E.title,E.content,g,m,null,u,c,p),this.#l.run(E.title,E.content,g,m,null,u,c,p)}return g})();return n&&this.#q(n),this.#P++,this.#P%r.OPTIMIZE_EVERY===0&&this.#j(),{sourceId:h,label:t,totalChunks:e.length,codeChunks:a}}#U(e){return e.map(t=>({title:t.title,content:t.content,source:t.label,rank:t.rank,contentType:t.content_type,highlighted:t.highlighted,timestamp:t.timestamp??void 0,sessionId:t.session_id??""}))}#s(e,t){return t==="exact"?e:`%${e.replace(/\\/g,"\\\\").replace(/%/g,"\\%").replace(/_/g,"\\_")}%`}search(e,t=3,n,s="AND",i,o="like"){let a=ht(e,s),u,c;return n&&i?(u=o==="exact"?this.#k:this.#R,c=[a,this.#s(n,o),i,t]):n?(u=o==="exact"?this.#E:this.#f,c=[a,this.#s(n,o),t]):i?(u=this.#T,c=[a,i,t]):(u=this.#m,c=[a,t]),w(()=>this.#U(u.all(...c)))}searchTrigram(e,t=3,n,s="AND",i,o="like"){let a=gt(e,s);if(!a)return[];let u,c;return n&&i?(u=o==="exact"?this.#D:this.#v,c=[a,this.#s(n,o),i,t]):n?(u=o==="exact"?this.#S:this.#y,c=[a,this.#s(n,o),t]):i?(u=this.#x,c=[a,i,t]):(u=this.#_,c=[a,t]),w(()=>this.#U(u.all(...c)))}fuzzyCorrect(e){let t=e.toLowerCase().trim();if(t.length<3)return null;if(this.#t.has(t)){let c=this.#t.get(t)??null;return this.#t.delete(t),this.#t.set(t,c),c}let n=mt(t.length),s=this.#b.all(t.length-n,t.length+n),i=null,o=n+1,a=!1;for(let{word:c}of s){if(c===t){a=!0;break}let l=pt(t,c);l<o&&(o=l,i=c)}let u=a?null:o<=n?i:null;if(this.#t.size>=r.FUZZY_CACHE_SIZE){let c=this.#t.keys().next().value;c!==void 0&&this.#t.delete(c)}return this.#t.set(t,u),u}#$(e,t,n,s,i="like"){let a=Math.max(t*2,10),u=this.search(e,a,n,"OR",s,i),c=this.searchTrigram(e,a,n,"OR",s,i),l=new Map,h=d=>`${d.source}::${d.title}`;for(let[d,g]of u.entries()){let p=h(g),E=l.get(p);E?E.score+=1/(60+d+1):l.set(p,{result:g,score:1/(60+d+1)})}for(let[d,g]of c.entries()){let p=h(g),E=l.get(p);E?E.score+=1/(60+d+1):l.set(p,{result:g,score:1/(60+d+1)})}return Array.from(l.values()).sort((d,g)=>g.score-d.score).slice(0,t).map(({result:d,score:g})=>({...d,rank:-g}))}#B(e,t){let n=t.toLowerCase().split(/\s+/).filter(o=>o.length>=2),s=n.filter(o=>!I.has(o)),i=s.length>0?s:n;return e.map(o=>{let a=o.title.toLowerCase(),u=i.filter(g=>a.includes(g)).length,c=o.contentType==="code"?.6:.3,l=u>0?c*(u/i.length):0,h=0,d=0;if(i.length>=2){let g=o.content.toLowerCase(),p=i.map(E=>St(g,E));if(!p.some(E=>E.length===0)){h=1/(1+Tt(p)/Math.max(g.length,1));let m=bt(p,i);d=.5*Math.min(1,m/4)}}return{result:o,boost:l+h+d}}).sort((o,a)=>a.boost-o.boost||o.result.rank-a.result.rank).map(({result:o})=>o)}searchWithFallback(e,t=3,n,s,i="like",o){this.#Y();let a=o?Math.max(t*8,40):t,u=this.#V(o),c=this.#$(e,a,n,s,i),l=u?c.filter(u):c;if(l.length>0)return this.#B(l.slice(0,t),e).map(m=>({...m,matchLayer:"rrf"}));let h=e.toLowerCase().trim().split(/\s+/).filter(E=>E.length>=3&&!I.has(E)),d=h.join(" "),p=h.map(E=>this.fuzzyCorrect(E)??E).join(" ");if(p!==d){let E=this.#$(p,a,n,s,i),m=u?E.filter(u):E;if(m.length>0)return this.#B(m.slice(0,t),p).map(f=>({...f,matchLayer:"rrf-fuzzy"}))}return[]}#V(e){return e?t=>{let n=t.sessionId??"";return n===""||e.has(n)}:null}lastRefreshCount=0;#Y(){this.lastRefreshCount=0;let e=this.#e.prepare("SELECT label, file_path, content_hash, indexed_at FROM sources WHERE file_path IS NOT NULL").all();for(let t of e)try{if(!ut(t.file_path)||this.#i&&this.#i(t.file_path))continue;let n=he(t.file_path).mtime,s=new Date(t.indexed_at+"Z");if(n<=s)continue;let i=ge(t.file_path,"r"),o;try{if(!pe(i).isFile())continue;o=de(i,"utf-8")}finally{me(i)}if(fe("sha256").update(o).digest("hex")===t.content_hash)continue;this.index({content:o,path:t.file_path,source:t.label}),this.lastRefreshCount++}catch{}}getSourceMeta(e){let t=this.#w.get(e);return t?{label:t.label,chunkCount:t.chunk_count,codeChunkCount:t.code_chunk_count,indexedAt:t.indexed_at,filePath:t.file_path??null,contentHash:t.content_hash??null}:null}listSources(){return this.#N.all()}getIndexState(){let e=this.#e.prepare("SELECT COALESCE(SUM(chunk_count), 0) AS total_chunks, COUNT(*) AS total_sources, MAX(indexed_at) AS last_indexed_at FROM sources").get();return{totalChunks:e.total_chunks??0,totalSources:e.total_sources??0,lastIndexedAt:e.last_indexed_at??void 0}}getChunksBySource(e){return this.#C.all(e).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(e,t=40){let n=this.#A.get(e);if(!n||n.chunk_count<3)return[];let s=n.chunk_count,i=2,o=Math.max(3,Math.ceil(s*.4)),a=new Map;for(let l of this.#L.iterate(e)){let h=new Set(l.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(d=>d.length>=3&&!I.has(d)));for(let d of h)a.set(d,(a.get(d)??0)+1)}return Array.from(a.entries()).filter(([,l])=>l>=i&&l<=o).map(([l,h])=>{let d=Math.log(s/h),g=Math.min(l.length/20,.5),p=/[_]/.test(l),E=l.length>=12,m=p?1.5:E?.8:0;return{word:l,score:d+g+m}}).sort((l,h)=>h.score-l.score).slice(0,t).map(l=>l.word)}getStats(){let e=this.#O.get();return{sources:e?.sources??0,chunks:e?.chunks??0,codeChunks:e?.codeChunks??0}}cleanupStaleSources(e){return this.#e.transaction(s=>(this.#I.run(s),this.#M.run(s),this.#F.run(s)))(e).changes}getDBSizeBytes(){try{return he(this.#n).size}catch{return 0}}#j(){try{this.#e.exec("INSERT INTO chunks(chunks) VALUES('optimize')"),this.#e.exec("INSERT INTO chunks_trigram(chunks_trigram) VALUES('optimize')")}catch{}}close(){this.#j(),Y(this.#e)}#q(e){let t=e.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(i=>i.length>=3&&!I.has(i)),n=[...new Set(t)],s=0;this.#e.transaction(()=>{for(let i of n){let o=this.#d.run(i);s+=o.changes}})(),s>0&&this.#t.clear()}#G(e,t=$){let n=[],s=e.split(`
`),i=[],o=[],a="",u=()=>{let l=o.join(`
`).trim();if(l.length===0)return;let h=this.#ee(i,a),d=o.some(_=>/^`{3,}/.test(_));if(Buffer.byteLength(l)<=t){n.push({title:h,content:l,hasCode:d}),o=[];return}let g=l.split(/\n\n+/),p=[],E=1,m=()=>{if(p.length===0)return;let _=p.join(`

`).trim();if(_.length===0)return;let f=g.length>1?`${h} (${E})`:h;E++,n.push({title:f,content:_,hasCode:_.includes("```")}),p=[]};for(let _ of g){p.push(_);let f=p.join(`

`);Buffer.byteLength(f)>t&&p.length>1&&(p.pop(),m(),p=[_])}m(),o=[]},c=0;for(;c<s.length;){let l=s[c];if(/^[-_*]{3,}\s*$/.test(l)){u(),c++;continue}let h=l.match(/^(#{1,4})\s+(.+)$/);if(h){u();let g=h[1].length,p=h[2].trim();for(;i.length>0&&i[i.length-1].level>=g;)i.pop();i.push({level:g,text:p}),a=p,o.push(l),c++;continue}let d=l.match(/^(`{3,})(.*)?$/);if(d){let g=d[1],p=[l];for(c++;c<s.length;){if(p.push(s[c]),s[c].startsWith(g)&&s[c].trim()===g){c++;break}c++}o.push(...p);continue}o.push(l),c++}return u(),n}#z(e,t){if(Buffer.byteLength(e)<=t)return e;let n="",s=0;for(let i of e){let o=Buffer.byteLength(i);if(s+o>t)break;n+=i,s+=o}return n.length===0?[...e][0]??"":n}#o(e,t,n){let s=[],i=[],o=1,a=()=>{if(i.length===0)return;let u=i.join(`
`),c=o===1?t:`${t} (${o})`;s.push({title:c,content:u}),o++,i=[]};for(let u of e){if(Buffer.byteLength(u)>n){a();let l=u,h=1;for(;l.length>0;){let d=this.#z(l,n);if(d.length<l.length){let p=d.lastIndexOf(" "),E=d.lastIndexOf(`
`),m=Math.max(p,E);m>d.length*yt&&(d=d.slice(0,m))}let g=o===1&&h===1?t:`${t} (${o}.${h})`;s.push({title:g,content:d}),l=l.slice(d.length),h++,o++}continue}let c=i.length>0?i.join(`
`)+`
`+u:u;Buffer.byteLength(c)>n&&i.length>0&&a(),i.push(u)}return a(),s}#K(e,t,n=$){let s=e.split(/\n\s*\n/);if(s.length>=ft&&s.length<=Et&&s.every(c=>Buffer.byteLength(c)<_t))return s.flatMap((c,l)=>{let h=c.trim();if(h.length===0)return[];let d=h.split(`
`)[0].slice(0,Ee)||`Section ${l+1}`;return Buffer.byteLength(h)<=n?[{title:d,content:h}]:this.#o(h.split(`
`),d,n)});let i=e.split(`
`);if(i.length<=t)return Buffer.byteLength(e)<=n?[{title:"Output",content:e}]:this.#o(i,"Output",n);let o=[],u=Math.max(t-2,1);for(let c=0;c<i.length;c+=u){let l=i.slice(c,c+t);if(l.length===0)break;let h=c+1,d=Math.min(c+l.length,i.length),g=l[0]?.trim().slice(0,Ee),p=l.join(`
`);if(Buffer.byteLength(p)<=n)o.push({title:g||`Lines ${h}-${d}`,content:p});else{let E=this.#o(l,g||`Lines ${h}-${d}`,n);o.push(...E)}}return o}#H(e,t,n,s){let i=t.length>0?t.join(" > "):"(root)",o=JSON.stringify(e,null,2);if(Buffer.byteLength(o)<=s&&!(typeof e=="object"&&e!==null&&!Array.isArray(e)&&Object.values(e).some(u=>typeof u=="object"&&u!==null))){n.push({title:i,content:o,hasCode:!0});return}if(typeof e=="object"&&e!==null&&!Array.isArray(e)){let a=Object.entries(e);if(a.length>0){for(let[u,c]of a)this.#H(c,[...t,u],n,s);return}n.push({title:i,content:o,hasCode:!0});return}if(Array.isArray(e)){this.#Z(e,t,n,s);return}n.push({title:i,content:o,hasCode:!1})}#J(e){if(e.length===0)return null;let t=e[0];if(typeof t!="object"||t===null||Array.isArray(t))return null;let n=["id","name","title","path","slug","key","label"],s=t;for(let i of n)if(i in s&&(typeof s[i]=="string"||typeof s[i]=="number"))return i;return null}#Q(e,t,n,s,i){let o=e?`${e} > `:"";if(!i)return t===n?`${o}[${t}]`:`${o}[${t}-${n}]`;let a=u=>String(u[i]);return s.length===1?`${o}${a(s[0])}`:s.length<=3?o+s.map(a).join(", "):`${o}${a(s[0])}\u2026${a(s[s.length-1])}`}#Z(e,t,n,s){let i=t.length>0?t.join(" > "):"(root)",o=this.#J(e),a=[],u=0,c=l=>{if(a.length===0)return;let h=this.#Q(i,u,l,a,o);n.push({title:h,content:JSON.stringify(a,null,2),hasCode:!0})};for(let l=0;l<e.length;l++){a.push(e[l]);let h=JSON.stringify(a,null,2);Buffer.byteLength(h)>s&&a.length>1&&(a.pop(),c(l-1),a=[e[l]],u=l)}c(u+a.length-1)}#ee(e,t){return e.length===0?t||"Untitled":e.map(n=>n.text).join(" > ")}};import{createHash as Te}from"node:crypto";import{accessSync as vn,constants as Dn,existsSync as ye,mkdirSync as Nn,realpathSync as Cn,renameSync as Se}from"node:fs";import{dirname as Ln,isAbsolute as On,join as be,resolve as wn}from"node:path";function Re(r){let e=r.replace(/\\/g,"/");return/^\/+$/.test(e)?"/":/^[A-Za-z]:\/+$/.test(e)?`${e.slice(0,2)}/`:e.replace(/\/+$/,"")}function Rt(r){return Te("sha256").update(Re(r)).digest("hex").slice(0,16)}function kt(r){let e=Re(r),t=process.platform==="darwin"||process.platform==="win32"?e.toLowerCase():e;return Te("sha256").update(t).digest("hex").slice(0,16)}function ke(r){let{projectDir:e,contentDir:t}=r,n=kt(e),s=be(t,`${n}.db`);if(ye(s))return s;let i=Rt(e);if(i===n)return s;let o=be(t,`${i}.db`);if(ye(o))try{Se(o,s);for(let a of["-wal","-shm"])try{Se(o+a,s+a)}catch{}}catch{}return s}var q="CONTEXT_WRAPPER_CONFIG";function De(r){let e=process.env[q];if(e){let n=M(e),s;try{s=G(n,"utf-8")}catch(i){throw new Error(`${q} points at "${n}" but it could not be read: ${i.message}`)}try{return{config:JSON.parse(s),configPath:n}}catch(i){throw new Error(`${q} config at "${n}" is not valid JSON: ${i.message}`)}}let t=M(r);for(;;){let n=z(t,".claude","context-mode.json");try{let i=G(n,"utf-8");return{config:JSON.parse(i),configPath:n}}catch{}let s=Nt(t);if(s===t)break;t=s}return null}function At(r,e){let t=e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${t}$`).test(r)}function K(r,e,t){let n=[];try{let s=xt(r);for(let i of s){let o=z(r,i);try{let a=xe(o);a.isDirectory()&&t?n.push(...K(o,e,!0)):a.isFile()&&At(i,e)&&n.push(o)}catch{}}}catch{}return n}function P(r,e){try{let t=G(r,"utf-8");return t.trim().length===0?null:{name:e?Ct(e,r):ve(r),path:r,content:t}}catch{return null}}function Lt(r){if(r.paths){let e=r.path||".";return r.paths.map(t=>M(e,t)).map(t=>P(t,e)).filter(t=>t!==null)}if(r.exec){let e=r.path||process.cwd();try{let t=Dt(r.exec,{cwd:e,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(t);return Array.isArray(n)?n.map(s=>M(e,s)).map(s=>P(s,e)).filter(s=>s!==null):(process.stderr.write(`[context-wrapper] exec for "${r.label}" did not return an array
`),[])}catch(t){return process.stderr.write(`[context-wrapper] exec for "${r.label}" failed: ${t.message}
`),[]}}return r.glob&&r.path?K(r.path,r.glob,!!r.recursive).map(e=>P(e,r.path)).filter(e=>e!==null):(process.stderr.write(`[context-wrapper] source "${r.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function Ot(r){if(!r.startsWith("---"))return r;let e=r.indexOf(`
---`,3);return e===-1?r:r.slice(e+4).replace(/^\n+/,"")}function wt(r,e){let t=e.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!t)return r;let n=t[1],s=r.split(`
`),i=[];for(let o of s){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(o))continue;let a=o.match(/^(##\s+)(.+)$/);a?i.push(`${a[1]}[${n}] ${a[2]}`):i.push(o)}return i.join(`
`)}function It(r){return r.replace(/\n{3,}/g,`

`)}function Ne(r,e,t){let n=r;return t?.stripFrontmatter&&(n=Ot(n)),t?.prefixDates&&(n=wt(n,e)),It(n)}function Mt(r,e){return Ne(r.content,r.name,{stripFrontmatter:e.stripFrontmatter,prefixDates:e.prefixDates})}function Ft(r,e){let t=z(r,"content");return vt(t,{recursive:!0}),ke({projectDir:M(e),contentDir:t})}function Ce(r){let e=M(r.path),t=xe(e),n=String(r.source??ve(e));if(t.isDirectory()){let i=r.glob??"*.md",o=r.recursive!==!1,a=K(e,i,o).map(u=>P(u,e)).filter(u=>u!==null);return{basePath:e,isDirectory:!0,files:a,sourcePrefix:n}}let s=P(e);return{basePath:e,isDirectory:!1,files:s?[s]:[],sourcePrefix:n}}function Ae(r,e){let t=e?.stripFrontmatter!==!1,n=e?.prefixDates===!0;return r.map(s=>({file:s,content:Ne(s.content,s.name,{stripFrontmatter:t,prefixDates:n})})).filter(s=>s.content.trim().length>0).map(s=>({...s,source:s.file.name}))}function Le(r,e,t){let n=Ft(e,t),s=new B(n),i=0,o=0,a=new Map;for(let u of r.sources){let c=Lt(u);if(c.length!==0)for(let l of c){let h=Mt(l,u);if(h.trim().length===0)continue;let d=`${u.label}: ${l.name}`,g=s.index({content:h,source:d});i++,o+=g.totalChunks;let p=a.get(u.label)??{label:u.label,description:u.description,files:0,chunks:0};p.files++,p.chunks+=g.totalChunks,a.set(u.label,p)}}return s.close(),{totalSources:i,totalChunks:o,dbPath:n,sources:[...a.values()]}}function Oe(r){return r.length===0?null:`Pre-warmed at startup and searchable now (no \`index\` call needed): ${r.map(t=>{let n=`\`${t.label}\` (${t.files} file${t.files===1?"":"s"})`;return t.description?`${n} \u2014 ${t.description}`:n}).join("; ")}. Scope to one with \`source: "<label>"\`.`}function Pt(r){return r.replace(/^⚠️ context-mode v[^\n]+ outdated → v[^\n]+ available\. Upgrade: [^\n]+\n\n/,"")}function we(r){let e=r?.content;if(Array.isArray(e))for(let t of e)t?.type==="text"&&typeof t.text=="string"&&(t.text=Pt(t.text))}function Ie(r,e){let t=r?.content;if(Array.isArray(t))for(let n of t){if(n?.type!=="text"||typeof n.text!="string")continue;let s=/\n\n⚠ search call #\d+\/\d+ in this window\..+$/s,i=/^BLOCKED: \d+ search calls in \d+s\..+$/s;s.test(n.text)?n.text=e===!1?n.text.replace(s,""):n.text.replace(s,`

${e}`):i.test(n.text)&&(n.text=e===!1?"":String(e))}}var Ue={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},Pe=new Map(Object.entries(Ue).map(([r,e])=>[e,r])),Kt=new Set(["ctx_stats","ctx_doctor","ctx_upgrade","ctx_purge","ctx_insight"]),j={execute:"Run code in the upstream sandbox. Use for derivation over files, command output, or fetched data without dumping raw bytes into context. When `path` is provided, the file is exposed inside the sandbox as FILE_CONTENT.",search:"Search indexed content with BM25/FTS5 ranking. Use after prewarm, index, fetch_and_index, batch_execute, or batch_read. Scope with `source` when you want results from a specific label or batch.",fetch_and_index:"Fetch one or more URLs, convert/index the content, and make it searchable. Use when the source is remote and you want retrieval via `search` instead of pasting raw page content into context.",batch_execute:"Run multiple shell commands, index their outputs, and optionally query the results in the same call. Use for multi-step collection where raw command output should converge into searchable indexed content."},Jt=new Set(["apps","packages","src","lib"]);function Qt(r){let e=r.split("/").filter(Boolean),t=-1;for(let s=e.length-1;s>=0;s--)if(Jt.has(e[s])){t=s;break}let n=t>=0?e.slice(t+1):e.slice(-2);return n=n.filter(s=>s!=="src"),n.join("/")}function Zt(r){let e=new Map;return r.map(t=>{let n=(e.get(t)??0)+1;return e.set(t,n),n>1?`${t} (${n})`:t})}function en(r){let t=(r?.content?.[0]?.text??"").match(/^Indexed (\d+) sections/);return t?parseInt(t[1],10):0}function Q(r,e){if(Array.isArray(r))return r.every(t=>typeof t=="string")?{ok:!0,value:r}:{ok:!1,message:`${e} must be an array of strings.`};if(typeof r=="string"){let t=r.trim();if(t.length===0)return{ok:!1,message:`${e} must not be empty.`};if(t.startsWith("[")){try{let n=JSON.parse(t);if(Array.isArray(n)&&n.every(s=>typeof s=="string"))return{ok:!0,value:n}}catch{}return{ok:!1,message:`${e} looks like a JSON array but did not parse to an array of strings: ${r}`}}return{ok:!0,value:[r]}}return{ok:!1,message:`${e} must be an array of strings.`}}function tn(r){return!!r&&r.type==="array"&&!!r.items&&r.items.type==="string"}function Z(r){let e={type:"array",items:r.items??{type:"string"}};return r.minItems!==void 0&&(e.minItems=r.minItems),{description:(r.description?r.description+" ":"")+'Accepts either an array of strings or a JSON-encoded array string, e.g. "[\\"a\\",\\"b\\"]".',anyOf:[e,{type:"string"}]}}function nn(r,e){if(!r?.properties)return r;let t={...r.properties};for(let n of e)tn(t[n])&&(t[n]=Z(t[n]));return{...r,properties:t}}async function rn(){let r=process.cwd(),e=De(r),t=$t(Me(Ut(),"context-mode-")),n=Fe(Wt(import.meta.url)),s=n.endsWith("/src")?Fe(n):n,i=Me(s,"node_modules","context-mode","server.bundle.mjs"),o=new qt({command:"node",args:[i],cwd:r,env:{...process.env,CONTEXT_MODE_DIR:t,CONTEXT_MODE_PROJECT_DIR:r,CLAUDE_PROJECT_DIR:r,PWD:r,CONTEXT_MODE_DISABLE_VERSION_CHECK:"1"},stderr:"inherit"}),a=new Yt({name:"context-wrapper",version:"0.2.0"});await a.connect(o);let u=o.pid;if(!u)throw new Error("Failed to get upstream server PID");process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${u})
`);let c=j.search;if(e){let m=performance.now(),_=Le(e.config,t,r),f=(performance.now()-m).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${_.totalChunks} chunks from ${_.totalSources} files in ${f}ms (${_.dbPath})
`);let D=Oe(_.sources);D&&(c+=`

${D}`)}let{tools:l}=await a.listTools(),h=l.find(m=>m.name==="ctx_execute_file"),d=l.filter(m=>!Kt.has(m.name)).filter(m=>m.name!=="ctx_execute_file").filter(m=>Pe.has(m.name)).map(m=>{let _=Pe.get(m.name);if(_==="execute"&&h){let f={...m.inputSchema.properties??{}};return h.inputSchema.properties?.path?f.path=h.inputSchema.properties.path:f.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...m,name:_,description:j.execute,inputSchema:{...m.inputSchema,properties:f}}}return _==="index"?{...m,name:_,description:"Store content in the searchable BM25 knowledge base. When `content` is provided, it is indexed directly. When `path` is provided, the wrapper reads files relative to the agent cwd, applies markdown preprocessing, and indexes each file as its own source.",inputSchema:{type:"object",properties:{content:{type:"string",description:"Raw text/markdown to index. Provide this OR path, not both."},path:{type:"string",description:"File or directory path to index. Relative paths resolve from the current working directory/worktree."},source:{type:"string",description:'Source label. For directories, each file gets "{source}: {relative/path}". Defaults to the directory basename or resolved file path.'},glob:{type:"string",description:'Directory-only filename pattern. Defaults to "*.md".'},recursive:{type:"boolean",description:"Directory-only recursive walk flag. Defaults to true."},stripFrontmatter:{type:"boolean",description:"Path-based indexing only. Strip YAML frontmatter before indexing. Defaults to true."},prefixDates:{type:"boolean",description:"Path-based indexing only. For YYYY-MM-DD.md files, prefix ## headings with [date]. Defaults to false."}}}}:_==="search"?{...m,name:_,description:c,inputSchema:nn(m.inputSchema,["queries"])}:_==="fetch_and_index"?{...m,name:_,description:j.fetch_and_index}:_==="batch_execute"?{...m,name:_,description:j.batch_execute}:{...m,name:_}});d.push({name:"batch_read",description:"Read multiple files, index them, and search across their contents. Use instead of batch_execute when all inputs are known file paths (no shell commands needed). Labels are auto-derived from file paths. Returns BM25 search results plus a batch ID \u2014 pass the batch ID as `source` to `search` for follow-up questions scoped to exactly these files.",inputSchema:{type:"object",properties:{files:Z({type:"array",items:{type:"string"},description:"File paths to read and index. Absolute paths preferred; relative paths resolve from the current working directory.",minItems:1}),queries:Z({type:"array",items:{type:"string"},description:"Search queries to run against the indexed content. Use 5\u20138 comprehensive queries. Each returns top matching sections.",minItems:1})},required:["files","queries"],additionalProperties:!1}});let g=new Xt({name:"context-wrapper",version:"0.2.0"},{capabilities:{tools:{}}});g.setRequestHandler(Gt,async()=>({tools:d})),g.setRequestHandler(zt,async m=>{let{name:_,arguments:f}=m.params;if(_==="index"&&f?.path!==void 0){let S=J(r,String(f.path)),y;try{y=Ce({path:S,source:typeof f.source=="string"?f.source:void 0,glob:typeof f.glob=="string"?f.glob:void 0,recursive:typeof f.recursive=="boolean"?f.recursive:void 0,stripFrontmatter:typeof f.stripFrontmatter=="boolean"?f.stripFrontmatter:void 0,prefixDates:typeof f.prefixDates=="boolean"?f.prefixDates:void 0})}catch(k){return{content:[{type:"text",text:`Index error: ${k.message}`}],isError:!0}}if(y.files.length===0)return{content:[{type:"text",text:y.isDirectory?`No files matched in ${y.basePath}.`:`Nothing indexable found at ${y.basePath}.`}]};let L=Ae(y.files,{stripFrontmatter:typeof f.stripFrontmatter=="boolean"?f.stripFrontmatter:void 0,prefixDates:typeof f.prefixDates=="boolean"?f.prefixDates:void 0}),R=0,N=0,b=[];for(let k of L){let v=y.isDirectory?`${y.sourcePrefix}: ${k.source}`:String(f.source??y.basePath);try{let U=await a.callTool({name:"ctx_index",arguments:{content:k.content,source:v}});N+=en(U),R++}catch(U){b.push(`${k.file.name}: ${U.message}`)}}let T=y.isDirectory?`Indexed ${R} file${R===1?"":"s"} (${N} chunks) from ${y.basePath}`:`Indexed ${N} sections from: ${String(f.source??y.basePath)}`;return{content:[{type:"text",text:b.length>0?`${T}

Errors (${b.length}):
${b.join(`
`)}`:T}],isError:b.length>0&&R===0}}if(_==="batch_read"){let S=Q(f?.files,"files"),y=Q(f?.queries,"queries"),L=[...S.ok?[]:[S.message],...y.ok?[]:[y.message]];if(L.length>0)return{content:[{type:"text",text:`Invalid arguments for batch_read:
${L.map(x=>`  - ${x}`).join(`
`)}`}],isError:!0};let R=S.value,N=y.value,b=Ht(3).toString("hex"),T=R.map(x=>Qt(J(r,x))),k=Zt(T),v=[];for(let x=0;x<R.length;x++){let ee=J(r,R[x]),He=`${b}/${k[x]}`,te;try{te=Bt(ee,"utf-8")}catch{v.push(ee);continue}await a.callTool({name:"ctx_index",arguments:{content:te,source:He}})}let $e=(await a.callTool({name:"ctx_search",arguments:{queries:N,source:b,limit:3}})).content?.[0]?.text??"(no results)",Be=v.length>0?`

\u26A0 Could not read ${v.length} file(s):
${v.map(x=>`  - ${x}`).join(`
`)}`:"",je=`

---
**Batch ID:** \`${b}\`
To search only these files: \`search(queries: [...], source: "${b}")\``;return{content:[{type:"text",text:$e+Be+je}]}}let D=f;if(_==="search"&&f?.queries!==void 0){let S=Q(f.queries,"queries");if(!S.ok)return{content:[{type:"text",text:`Invalid arguments for search:
  - ${S.message}`}],isError:!0};D={...f,queries:S.value}}let C;if(_==="execute"&&f?.path!==void 0?C="ctx_execute_file":C=Ue[_],!C)return{content:[{type:"text",text:`Unknown tool: ${_}`}],isError:!0};let A=await a.callTool({name:C,arguments:D});return we(A),_==="search"&&e?.config.searchReminder!==void 0&&Ie(A,e.config.searchReminder),A});let p=new Vt;await g.connect(p),process.stderr.write(`[context-wrapper] MCP server ready (${d.length} tools) [tmp=${t}]
`);let E=async()=>{await Promise.allSettled([a.close(),g.close()])};process.stdin.on("end",()=>process.exit(0)),process.on("SIGINT",async()=>{await E(),process.exit(0)}),process.on("SIGTERM",async()=>{await E(),process.exit(0)}),process.on("exit",()=>{try{process.kill(u)}catch{}try{jt(t,{recursive:!0,force:!0})}catch{}})}rn().catch(r=>{process.stderr.write(`[context-wrapper] Fatal: ${r.message}
${r.stack}
`),process.exit(1)});
