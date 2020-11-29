FROM python:3.8-slim

# Install python dependencies
COPY requirements requirements
RUN pip install --no-cache-dir -c requirements/constraints.txt -r requirements/prod.txt

COPY docker/api/healthcheck.py /usr/bin/
COPY docker/api/gunicorn.conf.py .
COPY api api

HEALTHCHECK CMD healthcheck.py || exit 1

EXPOSE 80

ENTRYPOINT ["gunicorn"]
CMD ["-c", "gunicorn.conf.py", "api.wsgi"]