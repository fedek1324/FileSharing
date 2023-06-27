# FileSharing
<p>Angular file sharing with a bootstrap interface that interacts with a local json server. It has authorization, registration, the ability to upload files. All data is stored in a local db.json file.</p>

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.1.3.

## How to run

<ol>  
  <h3>Setup:</h3>
  <li>Clone repository (no need to run npm i or something): <code>git clone https://github.com/fedek1324/FileSharing</code></li>
  <li>Open project folder: <code>cd FileSharing/</code></li>
  <li>Install json-server globally: <code>npm i -g json-server</code></li>
  <h3>Run:</h3>
  <li>Run DB server: <code>json-server --watch db.json</code></li>
  <li>Visit: <a href="https://file-sharing-sable.vercel.app/" target="_blank">File sharing on Vercel hosting</a></li>
</ol>

## Development server
Use node v12.x.x and use npm scripts to run project (e.g. npm run start).  Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
