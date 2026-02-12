# -------------------------------
# 1) Base Image
# -------------------------------
FROM python:3.10-slim

# -------------------------------
# 2) System dependencies
# -------------------------------
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# -------------------------------
# 3) Workdir
# -------------------------------
WORKDIR /app

# -------------------------------
# 4) Install Python dependencies
# -------------------------------
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# -------------------------------
# 5) Copy project
# -------------------------------
COPY . /app

# -------------------------------
# 6) Expose port
# -------------------------------
EXPOSE 7860

# -------------------------------
# 7) Start Gradio
# -------------------------------
CMD ["python", "app.py"]
