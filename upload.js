// upload.js
import {
  getSolidDataset,
  saveSolidDatasetAt,
  createSolidDataset,
  createThing,
  setThing,
  buildThing,
  addUrl,
  addStringNoLocale,
} from "@inrupt/solid-client";
import { Session } from "@inrupt/solid-client-authn-node";
import { RDF, DCAT, DCTERMS, FOAF } from "@inrupt/vocab-common-rdf";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf-8"));

const session = new Session();

async function uploadCatalog() {
  await session.login({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    oidcIssuer: config.oidcIssuer,
    refreshToken: config.refreshToken,
  });

  const catalogFile = fs.readFileSync(path.join(__dirname, "catalog.ttl"), "utf-8");
  const targetUrl = `${config.podBaseUrl}/public/catalog.ttl`;

  await fetch(targetUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "text/turtle",
      "Authorization": `Bearer ${session.accessToken}`,
    },
    body: catalogFile,
  });

  console.log(`✅ Catalog uploaded to ${targetUrl}`);
  await session.logout();
}

uploadCatalog().catch(console.error);
