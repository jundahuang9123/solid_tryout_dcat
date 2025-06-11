// App.jsx
import React, { useState } from "react";
import { SessionProvider, useSession, LoginButton, LogoutButton } from "@inrupt/solid-ui-react";
import { saveFileInContainer } from "@inrupt/solid-client";
import { getDefaultSession } from "@inrupt/solid-client-authn-browser";

function CatalogForm() {
  const { session } = useSession();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accessURL, setAccessURL] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ttl = `@prefix dcat: <http://www.w3.org/ns/dcat#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

<#catalog> a dcat:Catalog ;
  dct:title "${title}" ;
  dct:description "${description}" ;
  dcat:dataset <#dataset1> .

<#dataset1> a dcat:Dataset ;
  dct:title "${title} Dataset" ;
  dct:description "${description}" ;
  dcat:distribution <#dist1> .

<#dist1> a dcat:Distribution ;
  dcat:accessURL <${accessURL}> ;
  dct:format "text/turtle" .`;

    const blob = new Blob([ttl], { type: "text/turtle" });
    const filename = "catalog.ttl";
    const container = session.info.webId.replace(/\/profile\/card#me$/, "/public/");

    try {
      await saveFileInContainer(container, blob, { slug: filename, contentType: "text/turtle", fetch: session.fetch });
      setMessage("✅ Catalog uploaded successfully!");
    } catch (err) {
      setMessage(`❌ Upload failed: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="border p-2 w-full" />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="border p-2 w-full" />
      <input type="text" placeholder="Access URL" value={accessURL} onChange={(e) => setAccessURL(e.target.value)} className="border p-2 w-full" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Publish to Pod</button>
      {message && <div className="mt-2 text-sm">{message}</div>}
    </form>
  );
}

export default function App() {
  return (
    <SessionProvider sessionId="dcat-session">
      <div className="max-w-xl mx-auto mt-10 p-6 shadow rounded border">
        <h1 className="text-xl font-bold mb-4">Solid DCAT Catalog Publisher</h1>
        <LoginButton oidcIssuer="https://broker.pod.inrupt.com" redirectUrl={window.location.href} />
        <LogoutButton />
        <CatalogForm />
      </div>
    </SessionProvider>
  );
}
