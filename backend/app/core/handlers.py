from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.response import ApiResponse
from app.core.exceptions import BusinessException
from shared.status_codes import BizCode

def register_handlers(app):
    @app.exception_handler(BusinessException)
    async def biz_exc(request: Request, exc: BusinessException):
        return JSONResponse(
            status_code=exc.http_status,
            content=ApiResponse.error(
                biz_code=exc.biz_code, 
                message=exc.message
            ).model_dump()
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exc(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=ApiResponse.error(
                biz_code=BizCode.PARAM_ERROR,
                message="参数校验失败",
                data=[{"field": ".".join(str(x) for x in e["loc"]), "msg": e["msg"]} for e in exc.errors()]
            ).model_dump()
        )

    @app.exception_handler(Exception)
    async def generic_exc(request: Request, exc: Exception):
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ApiResponse.error(
                biz_code=BizCode.INTERNAL_ERROR,
                message=str(exc) if getattr(request.app.state, "debug", False) else "服务器内部错误"
            ).model_dump()
        )
