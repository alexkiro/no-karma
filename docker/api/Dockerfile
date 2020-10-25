FROM python:3.8-slim

# Install python dependencies
COPY requirements requirements
RUN pip install --no-cache-dir -c requirements/constraints.txt -r requirements/prod.txt

COPY api api

EXPOSE 80

ENTRYPOINT ["gunicorn"]
CMD ["--bind", "0.0.0.0:80", "api.wsgi"]