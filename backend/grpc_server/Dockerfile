FROM python:3.11-slim
WORKDIR /app

# install deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy package (keeps app/ package available)
COPY . .

# make sure Python can import the app package
ENV PYTHONPATH=/app:/app/generated

# run server as module entry
CMD ["python", "-u", "app/server.py"]