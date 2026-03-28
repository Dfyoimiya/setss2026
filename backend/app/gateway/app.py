'''
Author: Finley
创建时间: 2026-03-29 01:41:32
最后修改时间: 2026-03-29 01:55:49
文件路径: /backend/app/gateway/app.py
文件描述: 
'''

from typing import Dict
from fastapi import FastAPI

# initialize the fastapi app
app = FastAPI(
    title = 'SETSS 2026 API Gateway',
    description="Main entry point for the SETSS 2026 backend",
    version='0.1.0'
)

@app.get("/")
async def read_root() -> Dict[str, str]:
    """_summary_
        Root endpoint for testing connection
    Returns:
        Dict[str, str]: _description_
    """
    return {
        "message": "Hello, SETSS 2026!",
        "status": "Running",
        "mode": "Development"
    }

@app.get("/health")
async def health_check():
    """_summary_
    Health check endpoint for CI/CD and monitoring
    """
    return {"status": "ok", "service": "backend-gateway"}

# 这里的代码允许你直接运行 python app.py 进行快速调试
if __name__ == "__main__":
    import uvicorn
    print("Starting local development server...")
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)