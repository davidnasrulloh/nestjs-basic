import { ExecutionContext, HttpException, createParamDecorator } from "@nestjs/common";

export const Auth = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        // console.log('itemku user', data)
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if(user){
            return user
        } else {
            throw new HttpException("Unauthorized", 401);
            
        }
    }
)