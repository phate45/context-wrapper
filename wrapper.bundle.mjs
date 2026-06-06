import{join as De,dirname as ve,resolve as Y}from"node:path";import{tmpdir as bt}from"node:os";import{mkdtempSync as Tt,readFileSync as Rt,rmSync as xt}from"node:fs";import{randomBytes as kt}from"node:crypto";import{fileURLToPath as Dt}from"node:url";import{Server as vt}from"@modelcontextprotocol/sdk/server/index.js";import{StdioServerTransport as Nt}from"@modelcontextprotocol/sdk/server/stdio.js";import{Client as Ct}from"@modelcontextprotocol/sdk/client/index.js";import{StdioClientTransport as Lt}from"@modelcontextprotocol/sdk/client/stdio.js";import{ListToolsRequestSchema as Ot,CallToolRequestSchema as At}from"@modelcontextprotocol/sdk/types.js";import{readFileSync as _e,readdirSync as ut,statSync as Se,mkdirSync as lt}from"node:fs";import{execSync as dt}from"node:child_process";import{join as X,dirname as ht,basename as ye,resolve as M,relative as gt}from"node:path";import{createRequire as Oe}from"node:module";import{existsSync as Ae,unlinkSync as z,renameSync as Wt}from"node:fs";var $=class{#e;constructor(e){this.#e=e}pragma(e){let n=this.#e.prepare(`PRAGMA ${e}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let r=Object.values(n[0]);return r.length===1?r[0]:n[0]}exec(e){let t="",n=null;for(let o=0;o<e.length;o++){let i=e[o];if(n)t+=i,i===n&&(n=null);else if(i==="'"||i==='"')t+=i,n=i;else if(i===";"){let a=t.trim();a&&this.#e.prepare(a).run(),t=""}else t+=i}let r=t.trim();return r&&this.#e.prepare(r).run(),this}prepare(e){let t=this.#e.prepare(e);return{run:(...n)=>t.run(...n),get:(...n)=>{let r=t.get(...n);return r===null?void 0:r},all:(...n)=>t.all(...n),iterate:(...n)=>t.iterate(...n)}}transaction(e){return this.#e.transaction(e)}close(){this.#e.close()}},B=class{#e;constructor(e){this.#e=e}pragma(e){let n=this.#e.prepare(`PRAGMA ${e}`).all();if(!n||n.length===0)return;if(n.length>1)return n;let r=Object.values(n[0]);return r.length===1?r[0]:n[0]}exec(e){return this.#e.exec(e),this}prepare(e){let t=this.#e.prepare(e);return{run:(...n)=>t.run(...n),get:(...n)=>t.get(...n),all:(...n)=>t.all(...n),iterate:(...n)=>typeof t.iterate=="function"?t.iterate(...n):t.all(...n)[Symbol.iterator]()}}transaction(e){return(...t)=>{this.#e.exec("BEGIN");try{let n=e(...t);return this.#e.exec("COMMIT"),n}catch(n){throw this.#e.exec("ROLLBACK"),n}}}close(){this.#e.close()}},O=null;function we(s){let e=null;try{return e=new s(":memory:"),e.exec("CREATE VIRTUAL TABLE __fts5_probe USING fts5(x)"),!0}catch{return!1}finally{try{e?.close()}catch{}}}function Ie(s,e){let t=e!==void 0?e:globalThis.Bun;if(typeof t<"u"&&t!==null)return!0;let n=s??process.versions,[r,o]=(n.node??"0.0.0").split("."),i=Number(r),a=Number(o);return!Number.isFinite(i)||!Number.isFinite(a)?!1:i>22||i===22&&a>=5}function K(){if(!O){let s=Oe(import.meta.url);if(globalThis.Bun){let e=s(["bun","sqlite"].join(":")).Database;O=function(n,r){let o=new e(n,{readonly:r?.readonly,create:!0}),i=new $(o);return r?.timeout&&i.pragma(`busy_timeout = ${r.timeout}`),i}}else if(Ie()){let e=null;try{({DatabaseSync:e}=s(["node","sqlite"].join(":")))}catch{e=null}e&&we(e)?O=function(n,r){let o=new e(n,{readOnly:r?.readonly??!1}),i=new B(o);return r?.timeout&&i.pragma(`busy_timeout = ${r.timeout}`),i}:O=s("better-sqlite3")}else O=s("better-sqlite3")}return O}function j(s){s.pragma("journal_mode = WAL"),s.pragma("synchronous = NORMAL");try{s.pragma("mmap_size = 268435456")}catch{}}function H(s){if(!Ae(s))for(let e of["-wal","-shm"])try{z(s+e)}catch{}}function J(s){for(let e of["","-wal","-shm"])try{z(s+e)}catch{}}function W(s){try{s.pragma("wal_checkpoint(TRUNCATE)")}catch{}try{s.close()}catch{}}function A(s,e=[100,500,2e3]){let t;for(let n=0;n<=e.length;n++)try{return s()}catch(r){let o=r instanceof Error?r.message:String(r);if(!o.includes("SQLITE_BUSY")&&!o.includes("database is locked"))throw r;if(t=r instanceof Error?r:new Error(o),n<e.length){let i=e[n],a=Date.now();for(;Date.now()-a<i;);}}throw new Error(`SQLITE_BUSY: database is locked after ${e.length} retries. Original error: ${t?.message}`)}function Q(s){return s.includes("SQLITE_CORRUPT")||s.includes("SQLITE_NOTADB")||s.includes("database disk image is malformed")||s.includes("file is not a database")}var I=Symbol.for("__context_mode_live_dbs_v3__"),Xt=(()=>{let s=globalThis;return s[I]||(s[I]=new Set,process.on("exit",()=>{for(let e of s[I])W(e);s[I].clear()})),s[I]})();import{readFileSync as se,readdirSync as Jt,unlinkSync as Ke,existsSync as Je,statSync as ie,openSync as oe,fstatSync as ae,closeSync as ce}from"node:fs";import{createHash as ue}from"node:crypto";import{tmpdir as Qe}from"node:os";import{join as Ze}from"node:path";import{readdirSync as Fe,statSync as Me,lstatSync as Pe,realpathSync as Z,existsSync as Ue,readFileSync as $e}from"node:fs";import{join as te,extname as Be,relative as ne,sep as je,resolve as He}from"node:path";var We=["node_modules",".git","dist","build",".next","coverage",".venv","__pycache__",".DS_Store"],Xe=[".md",".mdx",".txt",".json",".yaml",".yml",".ts",".tsx",".js",".jsx",".py",".rs",".go",".sh"],Ve=5,Ye=200;function qe(s){let e="";for(let t=0;t<s.length;t++){let n=s[t];n==="*"?s[t+1]==="*"?(e+=".*",t++):e+="[^/]*":n==="?"?e+="[^/]":"\\^$.|+()[]{}".includes(n)?e+="\\"+n:e+=n}return new RegExp(`^${e}$`)}function ee(s,e){if(e.length===0)return!1;let t=s.split("/").pop()??s;for(let n of e){if(!n.includes("/")&&!n.includes("*")){if(t===n||s.split("/").includes(n))return!0;continue}let r=qe(n);if(r.test(s)||r.test(t))return!0}return!1}function Ge(s){let e=te(s,".gitignore");if(!Ue(e))return[];try{return $e(e,"utf-8").split(/\r?\n/).map(n=>n.trim()).filter(n=>n.length>0&&!n.startsWith("#")&&!n.startsWith("!")).map(n=>n.replace(/^\//,"").replace(/\/$/,""))}catch{return[]}}function ze(s,e){return ne(s,e).split(je).join("/")}function re(s,e={}){let{include:t,exclude:n,maxDepth:r=Ve,maxFiles:o=Ye,extensions:i,respectGitignore:a=!0,followSymlinks:u=!1}=e,c;try{c=Z(s)}catch{return{files:[],capped:!1,totalSeen:0}}let l=(i&&i.length>0?i:Xe).map(y=>(y.startsWith(".")?y:"."+y).toLowerCase()),g=[...We,...n??[],...a?Ge(c):[]],h=t??[],E=[],m=new Set([c]),d=0,p=!1;function f(y,C){if(p||C>r)return;let b;try{b=Fe(y,{withFileTypes:!0})}catch{return}for(let S of b){if(p)return;let _=te(y,S.name),T=ze(c,_);if(ee(T,g))continue;let D=S.isDirectory(),R=S.isFile(),L=!1;try{L=Pe(_).isSymbolicLink()}catch{continue}if(L){if(!u)continue;let x;try{x=Z(_)}catch{continue}let N=ne(c,x);if((N.startsWith("..")||He(N)===x)&&N.startsWith("..")||m.has(x))continue;m.add(x);try{let k=Me(x);D=k.isDirectory(),R=k.isFile()}catch{continue}}if(D){f(_,C+1);continue}if(!R)continue;let v=Be(_).toLowerCase();if(l.includes(v)&&!(h.length>0&&!ee(T,h))){if(d++,E.length>=o){p=!0;return}E.push(_)}}}return f(c,0),{files:E,capped:p,totalSeen:d}}var w=new Set(["the","and","for","are","but","not","you","all","can","had","her","was","one","our","out","has","his","how","its","may","new","now","old","see","way","who","did","get","got","let","say","she","too","use","will","with","this","that","from","they","been","have","many","some","them","than","each","make","like","just","over","such","take","into","year","your","good","could","would","about","which","their","there","other","after","should","through","also","more","most","only","very","when","what","then","these","those","being","does","done","both","same","still","while","where","here","were","much","update","updates","updated","deps","dev","tests","test","add","added","fix","fixed","run","running","using"]);function de(s){let e=new Set,t=[];for(let n of s){let r=n.toLowerCase();e.has(r)||(e.add(r),t.push(n))}return t}function et(s,e="AND"){let t=de(s.replace(/['"(){}[\]*:^~]/g," ").split(/\s+/).filter(o=>o.length>0&&!["AND","OR","NOT","NEAR"].includes(o.toUpperCase())));if(t.length===0)return'""';let n=t.filter(o=>!w.has(o.toLowerCase()));return(n.length>0?n:t).map(o=>`"${o}"`).join(e==="OR"?" OR ":" ")}function tt(s,e="AND"){let t=s.replace(/["'(){}[\]*:^~]/g,"").trim();if(t.length<3)return"";let n=de(t.split(/\s+/).filter(i=>i.length>=3));if(n.length===0)return"";let r=n.filter(i=>!w.has(i.toLowerCase()));return(r.length>0?r:n).map(i=>`"${i}"`).join(e==="OR"?" OR ":" ")}function nt(s,e){if(s.length===0)return e.length;if(e.length===0)return s.length;let t=Array.from({length:e.length+1},(n,r)=>r);for(let n=1;n<=s.length;n++){let r=[n];for(let o=1;o<=e.length;o++)r[o]=s[n-1]===e[o-1]?t[o-1]:1+Math.min(t[o],r[o-1],t[o-1]);t=r}return t[e.length]}function rt(s){return s<=4?1:s<=12?2:3}var le=4096;function st(s,e){let t=[],n=s.indexOf(e);for(;n!==-1;)t.push(n),n=s.indexOf(e,n+1);return t}function it(s,e,t=30){if(s.length<2||e.length<2)return 0;let n=0,r=Math.min(s.length,e.length)-1;for(let o=0;o<r;o++){let i=s[o],a=s[o+1],u=e[o].length,c=0;for(let l of i){let g=l+u,h=g+t;for(;c<a.length&&a[c]<g;)c++;c<a.length&&a[c]<=h&&(n++,c++)}}return n}function ot(s){if(s.length===0)return 1/0;if(s.length===1)return 0;let e=s,t=new Array(e.length).fill(0),n=1/0;for(;;){let r=1/0,o=-1/0,i=0;for(let u=0;u<e.length;u++){let c=e[u][t[u]];c<r&&(r=c,i=u),c>o&&(o=c)}let a=o-r;if(a<n&&(n=a),t[i]++,t[i]>=e[i].length)break}return n}var P=class s{#e;#n;#i;#o;#a;#c;#u;#l;#d;#h;#g;#p;#m;#f;#E;#_;#S;#y;#b;#T;#R;#x;#k;#D;#v;#N;#C;#L;#O;#A;#w;#I;#F;#M=0;static OPTIMIZE_EVERY=50;#t=new Map;static FUZZY_CACHE_SIZE=256;constructor(e){let t=K();this.#n=e??Ze(Qe(),`context-mode-${process.pid}.db`),H(this.#n);let n;try{n=new t(this.#n,{timeout:3e4}),j(n)}catch(r){let o=r instanceof Error?r.message:String(r);if(Q(o)){J(this.#n),H(this.#n);try{n=new t(this.#n,{timeout:3e4}),j(n)}catch(i){throw new Error(`Failed to create fresh DB after deleting corrupt file: ${i instanceof Error?i.message:String(i)}`)}}else throw r}this.#e=n,this.#H(),this.#W()}cleanup(){try{this.#e.close()}catch{}for(let e of["","-wal","-shm"])try{Ke(this.#n+e)}catch{}}#H(){this.#e.exec(`
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
        `))}catch{}try{this.#e.exec("ALTER TABLE sources ADD COLUMN file_path TEXT")}catch{}try{this.#e.exec("ALTER TABLE sources ADD COLUMN content_hash TEXT")}catch{}}#W(){this.#o=this.#e.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, 0, 0, ?, ?)"),this.#a=this.#e.prepare("INSERT INTO sources (label, chunk_count, code_chunk_count, file_path, content_hash) VALUES (?, ?, ?, ?, ?)"),this.#c=this.#e.prepare("INSERT INTO chunks (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#u=this.#e.prepare("INSERT INTO chunks_trigram (title, content, source_id, content_type, source_category, session_id, event_id, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"),this.#l=this.#e.prepare("INSERT OR IGNORE INTO vocabulary (word) VALUES (?)"),this.#d=this.#e.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#h=this.#e.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE label = ?)"),this.#g=this.#e.prepare("DELETE FROM sources WHERE label = ?"),this.#p=this.#e.prepare(`
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
    `),this.#m=this.#e.prepare(`
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
      WHERE chunks MATCH ? AND sources.label = ?
      ORDER BY rank
      LIMIT ?
    `),this.#E=this.#e.prepare(`
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
    `),this.#b=this.#e.prepare(`
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
      WHERE chunks MATCH ? AND sources.label LIKE ? ESCAPE '\\' AND chunks.content_type = ?
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
    `),this.#k=this.#e.prepare(`
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
    `),this.#y=this.#e.prepare("SELECT word FROM vocabulary WHERE length(word) BETWEEN ? AND ?"),this.#v=this.#e.prepare("SELECT label, chunk_count as chunkCount FROM sources ORDER BY id DESC"),this.#N=this.#e.prepare(`SELECT c.title, c.content, c.content_type, s.label
       FROM chunks c
       JOIN sources s ON s.id = c.source_id
       WHERE c.source_id = ?
       ORDER BY c.rowid`),this.#C=this.#e.prepare("SELECT chunk_count FROM sources WHERE id = ?"),this.#L=this.#e.prepare("SELECT content FROM chunks WHERE source_id = ?"),this.#A=this.#e.prepare("SELECT label, chunk_count, code_chunk_count, indexed_at, file_path, content_hash FROM sources WHERE label = ?"),this.#O=this.#e.prepare(`
      SELECT
        (SELECT COUNT(*) FROM sources) AS sources,
        (SELECT COUNT(*) FROM chunks) AS chunks,
        (SELECT COUNT(*) FROM chunks WHERE content_type = 'code') AS codeChunks
    `),this.#w=this.#e.prepare("DELETE FROM chunks WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#I=this.#e.prepare("DELETE FROM chunks_trigram WHERE source_id IN (SELECT id FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days'))"),this.#F=this.#e.prepare("DELETE FROM sources WHERE datetime(indexed_at) < datetime('now', '-' || ? || ' days')")}setDenyChecker(e){this.#i=e}index(e){let{content:t,path:n,source:r,attribution:o}=e,i=typeof t=="string"&&t.length>0;if(!i&&!n)throw new Error("Either content or path must be provided");let a;if(i)a=t;else{let h=oe(n,"r");try{if(!ae(h).isFile())throw new Error(`refusing to index ${n}: not a regular file`);a=se(h,"utf-8")}finally{ce(h)}}let u=r??n??"untitled",c=this.#q(a),l=n??void 0,g=l?ue("sha256").update(a).digest("hex"):void 0;return A(()=>this.#r(c,u,a,l,g,o))}indexDirectory(e){let{path:t,source:n,attribution:r,perFileDeny:o,...i}=e,a=re(t,i),u=0,c=0,l=0,g=0;for(let h of a.files){if(o&&o(h)){l++;continue}try{let E=n?`${n}:${h}`:h,m=this.index({path:h,source:E,attribution:r});u++,c+=m.totalChunks}catch{g++}}return{filesIndexed:u,totalChunks:c,capped:a.capped,totalSeen:a.totalSeen,denied:l,failed:g,label:n??t}}indexPlainText(e,t,n=20,r){if(!e||e.trim().length===0)return this.#r([],t,"",void 0,void 0,r);let o=this.#G(e,n);return A(()=>this.#r(o.map(i=>({...i,hasCode:!1})),t,e,void 0,void 0,r))}indexJSON(e,t,n=le,r){if(!e||e.trim().length===0)return this.indexPlainText("",t,void 0,r);let o;try{o=JSON.parse(e)}catch{return this.indexPlainText(e,t,void 0,r)}let i=[];return this.#j(o,[],i,n),i.length===0?this.indexPlainText(e,t,void 0,r):A(()=>this.#r(i,t,e,void 0,void 0,r))}#r(e,t,n,r,o,i){let a=e.filter(h=>h.hasCode).length,u=i?.sessionId??"",c=i?.eventId??"",g=this.#e.transaction(()=>{if(this.#d.run(t),this.#h.run(t),this.#g.run(t),e.length===0){let d=this.#o.run(t,r??null,o??null);return Number(d.lastInsertRowid)}let h=this.#a.run(t,e.length,a,r??null,o??null),E=Number(h.lastInsertRowid),m=new Date().toISOString();for(let d of e){let p=d.hasCode?"code":"prose";this.#c.run(d.title,d.content,E,p,null,u,c,m),this.#u.run(d.title,d.content,E,p,null,u,c,m)}return E})();return n&&this.#Y(n),this.#M++,this.#M%s.OPTIMIZE_EVERY===0&&this.#B(),{sourceId:g,label:t,totalChunks:e.length,codeChunks:a}}#P(e){return e.map(t=>({title:t.title,content:t.content,source:t.label,rank:t.rank,contentType:t.content_type,highlighted:t.highlighted,timestamp:t.timestamp??void 0,sessionId:t.session_id??""}))}#s(e,t){return t==="exact"?e:`%${e.replace(/\\/g,"\\\\").replace(/%/g,"\\%").replace(/_/g,"\\_")}%`}search(e,t=3,n,r="AND",o,i="like"){let a=et(e,r),u,c;return n&&o?(u=i==="exact"?this.#R:this.#T,c=[a,this.#s(n,i),o,t]):n?(u=i==="exact"?this.#f:this.#m,c=[a,this.#s(n,i),t]):o?(u=this.#b,c=[a,o,t]):(u=this.#p,c=[a,t]),A(()=>this.#P(u.all(...c)))}searchTrigram(e,t=3,n,r="AND",o,i="like"){let a=tt(e,r);if(!a)return[];let u,c;return n&&o?(u=i==="exact"?this.#D:this.#k,c=[a,this.#s(n,i),o,t]):n?(u=i==="exact"?this.#S:this.#_,c=[a,this.#s(n,i),t]):o?(u=this.#x,c=[a,o,t]):(u=this.#E,c=[a,t]),A(()=>this.#P(u.all(...c)))}fuzzyCorrect(e){let t=e.toLowerCase().trim();if(t.length<3)return null;if(this.#t.has(t)){let c=this.#t.get(t)??null;return this.#t.delete(t),this.#t.set(t,c),c}let n=rt(t.length),r=this.#y.all(t.length-n,t.length+n),o=null,i=n+1,a=!1;for(let{word:c}of r){if(c===t){a=!0;break}let l=nt(t,c);l<i&&(i=l,o=c)}let u=a?null:i<=n?o:null;if(this.#t.size>=s.FUZZY_CACHE_SIZE){let c=this.#t.keys().next().value;c!==void 0&&this.#t.delete(c)}return this.#t.set(t,u),u}#U(e,t,n,r,o="like"){let a=Math.max(t*2,10),u=this.search(e,a,n,"OR",r,o),c=this.searchTrigram(e,a,n,"OR",r,o),l=new Map,g=h=>`${h.source}::${h.title}`;for(let[h,E]of u.entries()){let m=g(E),d=l.get(m);d?d.score+=1/(60+h+1):l.set(m,{result:E,score:1/(60+h+1)})}for(let[h,E]of c.entries()){let m=g(E),d=l.get(m);d?d.score+=1/(60+h+1):l.set(m,{result:E,score:1/(60+h+1)})}return Array.from(l.values()).sort((h,E)=>E.score-h.score).slice(0,t).map(({result:h,score:E})=>({...h,rank:-E}))}#$(e,t){let n=t.toLowerCase().split(/\s+/).filter(i=>i.length>=2),r=n.filter(i=>!w.has(i)),o=r.length>0?r:n;return e.map(i=>{let a=i.title.toLowerCase(),u=o.filter(E=>a.includes(E)).length,c=i.contentType==="code"?.6:.3,l=u>0?c*(u/o.length):0,g=0,h=0;if(o.length>=2){let E=i.content.toLowerCase(),m=o.map(d=>st(E,d));if(!m.some(d=>d.length===0)){g=1/(1+ot(m)/Math.max(E.length,1));let p=it(m,o);h=.5*Math.min(1,p/4)}}return{result:i,boost:l+g+h}}).sort((i,a)=>a.boost-i.boost||i.result.rank-a.result.rank).map(({result:i})=>i)}searchWithFallback(e,t=3,n,r,o="like",i){this.#V();let a=i?Math.max(t*8,40):t,u=this.#X(i),c=this.#U(e,a,n,r,o),l=u?c.filter(u):c;if(l.length>0)return this.#$(l.slice(0,t),e).map(p=>({...p,matchLayer:"rrf"}));let g=e.toLowerCase().trim().split(/\s+/).filter(d=>d.length>=3&&!w.has(d)),h=g.join(" "),m=g.map(d=>this.fuzzyCorrect(d)??d).join(" ");if(m!==h){let d=this.#U(m,a,n,r,o),p=u?d.filter(u):d;if(p.length>0)return this.#$(p.slice(0,t),m).map(y=>({...y,matchLayer:"rrf-fuzzy"}))}return[]}#X(e){return e?t=>{let n=t.sessionId??"";return n===""||e.has(n)}:null}lastRefreshCount=0;#V(){this.lastRefreshCount=0;let e=this.#e.prepare("SELECT label, file_path, content_hash, indexed_at FROM sources WHERE file_path IS NOT NULL").all();for(let t of e)try{if(!Je(t.file_path)||this.#i&&this.#i(t.file_path))continue;let n=ie(t.file_path).mtime,r=new Date(t.indexed_at+"Z");if(n<=r)continue;let o=oe(t.file_path,"r"),i;try{if(!ae(o).isFile())continue;i=se(o,"utf-8")}finally{ce(o)}if(ue("sha256").update(i).digest("hex")===t.content_hash)continue;this.index({content:i,path:t.file_path,source:t.label}),this.lastRefreshCount++}catch{}}getSourceMeta(e){let t=this.#A.get(e);return t?{label:t.label,chunkCount:t.chunk_count,codeChunkCount:t.code_chunk_count,indexedAt:t.indexed_at,filePath:t.file_path??null,contentHash:t.content_hash??null}:null}listSources(){return this.#v.all()}getIndexState(){let e=this.#e.prepare("SELECT COALESCE(SUM(chunk_count), 0) AS total_chunks, COUNT(*) AS total_sources, MAX(indexed_at) AS last_indexed_at FROM sources").get();return{totalChunks:e.total_chunks??0,totalSources:e.total_sources??0,lastIndexedAt:e.last_indexed_at??void 0}}getChunksBySource(e){return this.#N.all(e).map(n=>({title:n.title,content:n.content,source:n.label,rank:0,contentType:n.content_type}))}getDistinctiveTerms(e,t=40){let n=this.#C.get(e);if(!n||n.chunk_count<3)return[];let r=n.chunk_count,o=2,i=Math.max(3,Math.ceil(r*.4)),a=new Map;for(let l of this.#L.iterate(e)){let g=new Set(l.content.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(h=>h.length>=3&&!w.has(h)));for(let h of g)a.set(h,(a.get(h)??0)+1)}return Array.from(a.entries()).filter(([,l])=>l>=o&&l<=i).map(([l,g])=>{let h=Math.log(r/g),E=Math.min(l.length/20,.5),m=/[_]/.test(l),d=l.length>=12,p=m?1.5:d?.8:0;return{word:l,score:h+E+p}}).sort((l,g)=>g.score-l.score).slice(0,t).map(l=>l.word)}getStats(){let e=this.#O.get();return{sources:e?.sources??0,chunks:e?.chunks??0,codeChunks:e?.codeChunks??0}}cleanupStaleSources(e){return this.#e.transaction(r=>(this.#w.run(r),this.#I.run(r),this.#F.run(r)))(e).changes}getDBSizeBytes(){try{return ie(this.#n).size}catch{return 0}}#B(){try{this.#e.exec("INSERT INTO chunks(chunks) VALUES('optimize')"),this.#e.exec("INSERT INTO chunks_trigram(chunks_trigram) VALUES('optimize')")}catch{}}close(){this.#B(),W(this.#e)}#Y(e){let t=e.toLowerCase().split(/[^\p{L}\p{N}_-]+/u).filter(o=>o.length>=3&&!w.has(o)),n=[...new Set(t)],r=0;this.#e.transaction(()=>{for(let o of n){let i=this.#l.run(o);r+=i.changes}})(),r>0&&this.#t.clear()}#q(e,t=le){let n=[],r=e.split(`
`),o=[],i=[],a="",u=()=>{let l=i.join(`
`).trim();if(l.length===0)return;let g=this.#Q(o,a),h=i.some(f=>/^`{3,}/.test(f));if(Buffer.byteLength(l)<=t){n.push({title:g,content:l,hasCode:h}),i=[];return}let E=l.split(/\n\n+/),m=[],d=1,p=()=>{if(m.length===0)return;let f=m.join(`

`).trim();if(f.length===0)return;let y=E.length>1?`${g} (${d})`:g;d++,n.push({title:y,content:f,hasCode:f.includes("```")}),m=[]};for(let f of E){m.push(f);let y=m.join(`

`);Buffer.byteLength(y)>t&&m.length>1&&(m.pop(),p(),m=[f])}p(),i=[]},c=0;for(;c<r.length;){let l=r[c];if(/^[-_*]{3,}\s*$/.test(l)){u(),c++;continue}let g=l.match(/^(#{1,4})\s+(.+)$/);if(g){u();let E=g[1].length,m=g[2].trim();for(;o.length>0&&o[o.length-1].level>=E;)o.pop();o.push({level:E,text:m}),a=m,i.push(l),c++;continue}let h=l.match(/^(`{3,})(.*)?$/);if(h){let E=h[1],m=[l];for(c++;c<r.length;){if(m.push(r[c]),r[c].startsWith(E)&&r[c].trim()===E){c++;break}c++}i.push(...m);continue}i.push(l),c++}return u(),n}#G(e,t){let n=e.split(/\n\s*\n/);if(n.length>=3&&n.length<=200&&n.every(u=>Buffer.byteLength(u)<5e3))return n.map((u,c)=>{let l=u.trim();return{title:l.split(`
`)[0].slice(0,80)||`Section ${c+1}`,content:l}}).filter(u=>u.content.length>0);let r=e.split(`
`);if(r.length<=t)return[{title:"Output",content:e}];let o=[],a=Math.max(t-2,1);for(let u=0;u<r.length;u+=a){let c=r.slice(u,u+t);if(c.length===0)break;let l=u+1,g=Math.min(u+c.length,r.length),h=c[0]?.trim().slice(0,80);o.push({title:h||`Lines ${l}-${g}`,content:c.join(`
`)})}return o}#j(e,t,n,r){let o=t.length>0?t.join(" > "):"(root)",i=JSON.stringify(e,null,2);if(Buffer.byteLength(i)<=r&&!(typeof e=="object"&&e!==null&&!Array.isArray(e)&&Object.values(e).some(u=>typeof u=="object"&&u!==null))){n.push({title:o,content:i,hasCode:!0});return}if(typeof e=="object"&&e!==null&&!Array.isArray(e)){let a=Object.entries(e);if(a.length>0){for(let[u,c]of a)this.#j(c,[...t,u],n,r);return}n.push({title:o,content:i,hasCode:!0});return}if(Array.isArray(e)){this.#J(e,t,n,r);return}n.push({title:o,content:i,hasCode:!1})}#z(e){if(e.length===0)return null;let t=e[0];if(typeof t!="object"||t===null||Array.isArray(t))return null;let n=["id","name","title","path","slug","key","label"],r=t;for(let o of n)if(o in r&&(typeof r[o]=="string"||typeof r[o]=="number"))return o;return null}#K(e,t,n,r,o){let i=e?`${e} > `:"";if(!o)return t===n?`${i}[${t}]`:`${i}[${t}-${n}]`;let a=u=>String(u[o]);return r.length===1?`${i}${a(r[0])}`:r.length<=3?i+r.map(a).join(", "):`${i}${a(r[0])}\u2026${a(r[r.length-1])}`}#J(e,t,n,r){let o=t.length>0?t.join(" > "):"(root)",i=this.#z(e),a=[],u=0,c=l=>{if(a.length===0)return;let g=this.#K(o,u,l,a,i);n.push({title:g,content:JSON.stringify(a,null,2),hasCode:!0})};for(let l=0;l<e.length;l++){a.push(e[l]);let g=JSON.stringify(a,null,2);Buffer.byteLength(g)>r&&a.length>1&&(a.pop(),c(l-1),a=[e[l]],u=l)}c(u+a.length-1)}#Q(e,t){return e.length===0?t||"Untitled":e.map(n=>n.text).join(" > ")}};import{createHash as me}from"node:crypto";import{accessSync as un,constants as ln,existsSync as he,mkdirSync as dn,realpathSync as hn,renameSync as ge}from"node:fs";import{dirname as pn,isAbsolute as mn,join as pe,resolve as fn}from"node:path";function fe(s){let e=s.replace(/\\/g,"/");return/^\/+$/.test(e)?"/":/^[A-Za-z]:\/+$/.test(e)?`${e.slice(0,2)}/`:e.replace(/\/+$/,"")}function at(s){return me("sha256").update(fe(s)).digest("hex").slice(0,16)}function ct(s){let e=fe(s),t=process.platform==="darwin"||process.platform==="win32"?e.toLowerCase():e;return me("sha256").update(t).digest("hex").slice(0,16)}function Ee(s){let{projectDir:e,contentDir:t}=s,n=ct(e),r=pe(t,`${n}.db`);if(he(r))return r;let o=at(e);if(o===n)return r;let i=pe(t,`${o}.db`);if(he(i))try{ge(i,r);for(let a of["-wal","-shm"])try{ge(i+a,r+a)}catch{}}catch{}return r}function be(s){let e=M(s);for(;;){let t=X(e,".claude","context-mode.json");try{let r=_e(t,"utf-8");return{config:JSON.parse(r),configPath:t}}catch{}let n=ht(e);if(n===e)break;e=n}return null}function pt(s,e){let t=e.replace(/[.+^${}()|[\]\\]/g,"\\$&").replace(/\*/g,".*").replace(/\?/g,".");return new RegExp(`^${t}$`).test(s)}function V(s,e,t){let n=[];try{let r=ut(s);for(let o of r){let i=X(s,o);try{let a=Se(i);a.isDirectory()&&t?n.push(...V(i,e,!0)):a.isFile()&&pt(o,e)&&n.push(i)}catch{}}}catch{}return n}function F(s,e){try{let t=_e(s,"utf-8");return t.trim().length===0?null:{name:e?gt(e,s):ye(s),path:s,content:t}}catch{return null}}function mt(s){if(s.paths){let e=s.path||".";return s.paths.map(t=>M(e,t)).map(t=>F(t,e)).filter(t=>t!==null)}if(s.exec){let e=s.path||process.cwd();try{let t=dt(s.exec,{cwd:e,encoding:"utf-8",timeout:1e4}).trim(),n=JSON.parse(t);return Array.isArray(n)?n.map(r=>M(e,r)).map(r=>F(r,e)).filter(r=>r!==null):(process.stderr.write(`[context-wrapper] exec for "${s.label}" did not return an array
`),[])}catch(t){return process.stderr.write(`[context-wrapper] exec for "${s.label}" failed: ${t.message}
`),[]}}return s.glob&&s.path?V(s.path,s.glob,!!s.recursive).map(e=>F(e,s.path)).filter(e=>e!==null):(process.stderr.write(`[context-wrapper] source "${s.label}" has no file selection strategy (need glob+path, exec, or paths)
`),[])}function ft(s){if(!s.startsWith("---"))return s;let e=s.indexOf(`
---`,3);return e===-1?s:s.slice(e+4).replace(/^\n+/,"")}function Et(s,e){let t=e.match(/^(\d{4}-\d{2}-\d{2})\.md$/);if(!t)return s;let n=t[1],r=s.split(`
`),o=[];for(let i of r){if(/^##\s+\d{4}-\d{2}-\d{2}\s*$/.test(i))continue;let a=i.match(/^(##\s+)(.+)$/);a?o.push(`${a[1]}[${n}] ${a[2]}`):o.push(i)}return o.join(`
`)}function _t(s){return s.replace(/\n{3,}/g,`

`)}function Te(s,e,t){let n=s;return t?.stripFrontmatter&&(n=ft(n)),t?.prefixDates&&(n=Et(n,e)),_t(n)}function St(s,e){return Te(s.content,s.name,{stripFrontmatter:e.stripFrontmatter,prefixDates:e.prefixDates})}function yt(s,e){let t=X(s,"content");return lt(t,{recursive:!0}),Ee({projectDir:M(e),contentDir:t})}function Re(s){let e=M(s.path),t=Se(e),n=String(s.source??ye(e));if(t.isDirectory()){let o=s.glob??"*.md",i=s.recursive!==!1,a=V(e,o,i).map(u=>F(u,e)).filter(u=>u!==null);return{basePath:e,isDirectory:!0,files:a,sourcePrefix:n}}let r=F(e);return{basePath:e,isDirectory:!1,files:r?[r]:[],sourcePrefix:n}}function xe(s,e){let t=e?.stripFrontmatter!==!1,n=e?.prefixDates===!0;return s.map(r=>({file:r,content:Te(r.content,r.name,{stripFrontmatter:t,prefixDates:n})})).filter(r=>r.content.trim().length>0).map(r=>({...r,source:r.file.name}))}function ke(s,e,t){let n=yt(e,t),r=new P(n),o=0,i=0;for(let a of s.sources){let u=mt(a);if(u.length!==0)for(let c of u){let l=St(c,a);if(l.trim().length===0)continue;let g=`${a.label}: ${c.name}`,h=r.index({content:l,source:g});o++,i+=h.totalChunks}}return r.close(),{totalSources:o,totalChunks:i,dbPath:n}}var Ce={execute:"ctx_execute",index:"ctx_index",search:"ctx_search",fetch_and_index:"ctx_fetch_and_index",batch_execute:"ctx_batch_execute"},Ne=new Map(Object.entries(Ce).map(([s,e])=>[e,s])),wt=new Set(["ctx_stats","ctx_doctor","ctx_upgrade","ctx_purge","ctx_insight"]),U={execute:"Run code in the upstream sandbox. Use for derivation over files, command output, or fetched data without dumping raw bytes into context. When `path` is provided, the file is exposed inside the sandbox as FILE_CONTENT.",search:"Search indexed content with BM25/FTS5 ranking. Use after prewarm, index, fetch_and_index, batch_execute, or batch_read. Scope with `source` when you want results from a specific label or batch.",fetch_and_index:"Fetch one or more URLs, convert/index the content, and make it searchable. Use when the source is remote and you want retrieval via `search` instead of pasting raw page content into context.",batch_execute:"Run multiple shell commands, index their outputs, and optionally query the results in the same call. Use for multi-step collection where raw command output should converge into searchable indexed content."},It=new Set(["apps","packages","src","lib"]);function Ft(s){let e=s.split("/").filter(Boolean),t=-1;for(let r=e.length-1;r>=0;r--)if(It.has(e[r])){t=r;break}let n=t>=0?e.slice(t+1):e.slice(-2);return n=n.filter(r=>r!=="src"),n.join("/")}function Mt(s){let e=new Map;return s.map(t=>{let n=(e.get(t)??0)+1;return e.set(t,n),n>1?`${t} (${n})`:t})}function Pt(s){let t=(s?.content?.[0]?.text??"").match(/^Indexed (\d+) sections/);return t?parseInt(t[1],10):0}function Ut(s){return s.replace(/^⚠️ context-mode v[^\n]+ outdated → v[^\n]+ available\. Upgrade: [^\n]+\n\n/,"")}function $t(s){let e=s?.content;if(Array.isArray(e))for(let t of e)t?.type==="text"&&typeof t.text=="string"&&(t.text=Ut(t.text))}async function Bt(){let s=process.cwd(),e=be(s),t=Tt(De(bt(),"context-mode-")),n=ve(Dt(import.meta.url)),r=n.endsWith("/src")?ve(n):n,o=De(r,"node_modules","context-mode","server.bundle.mjs"),i=new Lt({command:"node",args:[o],cwd:s,env:{...process.env,CONTEXT_MODE_DIR:t,CONTEXT_MODE_PROJECT_DIR:s,CLAUDE_PROJECT_DIR:s,PWD:s},stderr:"inherit"}),a=new Ct({name:"context-wrapper",version:"0.2.0"});await a.connect(i);let u=i.pid;if(!u)throw new Error("Failed to get upstream server PID");if(process.stderr.write(`[context-wrapper] Connected to upstream server (pid ${u})
`),e){let d=performance.now(),p=ke(e.config,t,s),f=(performance.now()-d).toFixed(0);process.stderr.write(`[context-wrapper] Pre-warmed ${p.totalChunks} chunks from ${p.totalSources} files in ${f}ms (${p.dbPath})
`)}let{tools:c}=await a.listTools(),l=c.find(d=>d.name==="ctx_execute_file"),g=c.filter(d=>!wt.has(d.name)).filter(d=>d.name!=="ctx_execute_file").filter(d=>Ne.has(d.name)).map(d=>{let p=Ne.get(d.name);if(p==="execute"&&l){let f={...d.inputSchema.properties??{}};return l.inputSchema.properties?.path?f.path=l.inputSchema.properties.path:f.path={type:"string",description:"Absolute file path or relative to project root. When provided, reads this file into a FILE_CONTENT variable inside the sandbox \u2014 file contents stay in sandbox, only your printed output enters context."},{...d,name:p,description:U.execute,inputSchema:{...d.inputSchema,properties:f}}}return p==="index"?{...d,name:p,description:"Store content in the searchable BM25 knowledge base. When `content` is provided, it is indexed directly. When `path` is provided, the wrapper reads files relative to the agent cwd, applies markdown preprocessing, and indexes each file as its own source.",inputSchema:{type:"object",properties:{content:{type:"string",description:"Raw text/markdown to index. Provide this OR path, not both."},path:{type:"string",description:"File or directory path to index. Relative paths resolve from the current working directory/worktree."},source:{type:"string",description:'Source label. For directories, each file gets "{source}: {relative/path}". Defaults to the directory basename or resolved file path.'},glob:{type:"string",description:'Directory-only filename pattern. Defaults to "*.md".'},recursive:{type:"boolean",description:"Directory-only recursive walk flag. Defaults to true."},stripFrontmatter:{type:"boolean",description:"Path-based indexing only. Strip YAML frontmatter before indexing. Defaults to true."},prefixDates:{type:"boolean",description:"Path-based indexing only. For YYYY-MM-DD.md files, prefix ## headings with [date]. Defaults to false."}}}}:p==="search"?{...d,name:p,description:U.search}:p==="fetch_and_index"?{...d,name:p,description:U.fetch_and_index}:p==="batch_execute"?{...d,name:p,description:U.batch_execute}:{...d,name:p}});g.push({name:"batch_read",description:"Read multiple files, index them, and search across their contents. Use instead of batch_execute when all inputs are known file paths (no shell commands needed). Labels are auto-derived from file paths. Returns BM25 search results plus a batch ID \u2014 pass the batch ID as `source` to `search` for follow-up questions scoped to exactly these files.",inputSchema:{type:"object",properties:{files:{type:"array",items:{type:"string"},description:"File paths to read and index. Absolute paths preferred; relative paths resolve from the current working directory.",minItems:1},queries:{type:"array",items:{type:"string"},description:"Search queries to run against the indexed content. Use 5\u20138 comprehensive queries. Each returns top matching sections.",minItems:1}},required:["files","queries"],additionalProperties:!1}});let h=new vt({name:"context-wrapper",version:"0.2.0"},{capabilities:{tools:{}}});h.setRequestHandler(Ot,async()=>({tools:g})),h.setRequestHandler(At,async d=>{let{name:p,arguments:f}=d.params;if(p==="index"&&f?.path!==void 0){let b=Y(s,String(f.path)),S;try{S=Re({path:b,source:typeof f.source=="string"?f.source:void 0,glob:typeof f.glob=="string"?f.glob:void 0,recursive:typeof f.recursive=="boolean"?f.recursive:void 0,stripFrontmatter:typeof f.stripFrontmatter=="boolean"?f.stripFrontmatter:void 0,prefixDates:typeof f.prefixDates=="boolean"?f.prefixDates:void 0})}catch(v){return{content:[{type:"text",text:`Index error: ${v.message}`}],isError:!0}}if(S.files.length===0)return{content:[{type:"text",text:S.isDirectory?`No files matched in ${S.basePath}.`:`Nothing indexable found at ${S.basePath}.`}]};let _=xe(S.files,{stripFrontmatter:typeof f.stripFrontmatter=="boolean"?f.stripFrontmatter:void 0,prefixDates:typeof f.prefixDates=="boolean"?f.prefixDates:void 0}),T=0,D=0,R=[];for(let v of _){let x=S.isDirectory?`${S.sourcePrefix}: ${v.source}`:String(f.source??S.basePath);try{let N=await a.callTool({name:"ctx_index",arguments:{content:v.content,source:x}});D+=Pt(N),T++}catch(N){R.push(`${v.file.name}: ${N.message}`)}}let L=S.isDirectory?`Indexed ${T} file${T===1?"":"s"} (${D} chunks) from ${S.basePath}`:`Indexed ${D} sections from: ${String(f.source??S.basePath)}`;return{content:[{type:"text",text:R.length>0?`${L}

Errors (${R.length}):
${R.join(`
`)}`:L}],isError:R.length>0&&T===0}}if(p==="batch_read"){let{files:b,queries:S}=f,_=kt(3).toString("hex"),T=b.map(k=>Ft(Y(s,k))),D=Mt(T),R=[];for(let k=0;k<b.length;k++){let q=Y(s,b[k]),Le=`${_}/${D[k]}`,G;try{G=Rt(q,"utf-8")}catch{R.push(q);continue}await a.callTool({name:"ctx_index",arguments:{content:G,source:Le}})}let v=(await a.callTool({name:"ctx_search",arguments:{queries:S,source:_,limit:3}})).content?.[0]?.text??"(no results)",x=R.length>0?`

\u26A0 Could not read ${R.length} file(s):
${R.map(k=>`  - ${k}`).join(`
`)}`:"",N=`

---
**Batch ID:** \`${_}\`
To search only these files: \`search(queries: [...], source: "${_}")\``;return{content:[{type:"text",text:v+x+N}]}}let y;if(p==="execute"&&f?.path!==void 0?y="ctx_execute_file":y=Ce[p],!y)return{content:[{type:"text",text:`Unknown tool: ${p}`}],isError:!0};let C=await a.callTool({name:y,arguments:f});if($t(C),p==="search"&&e?.config.searchReminder!==void 0){let b=e.config.searchReminder,S=C.content;if(Array.isArray(S))for(let _ of S){if(_.type!=="text"||typeof _.text!="string")continue;let T=/\n\n⚠ search call #\d+\/\d+ in this window\..+$/s,D=/^BLOCKED: \d+ search calls in \d+s\..+$/s;T.test(_.text)?_.text=b===!1?_.text.replace(T,""):_.text.replace(T,`

${b}`):D.test(_.text)&&(_.text=b===!1?"":String(b))}}return C});let E=new Nt;await h.connect(E),process.stderr.write(`[context-wrapper] MCP server ready (${g.length} tools) [tmp=${t}]
`);let m=async()=>{await Promise.allSettled([a.close(),h.close()])};process.stdin.on("end",()=>process.exit(0)),process.on("SIGINT",async()=>{await m(),process.exit(0)}),process.on("SIGTERM",async()=>{await m(),process.exit(0)}),process.on("exit",()=>{try{process.kill(u)}catch{}try{xt(t,{recursive:!0,force:!0})}catch{}})}Bt().catch(s=>{process.stderr.write(`[context-wrapper] Fatal: ${s.message}
${s.stack}
`),process.exit(1)});
