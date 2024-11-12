import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { LoginService } from "./services/login.service";
import { inject } from "@angular/core";

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
	const loginService = inject(LoginService);
	const token = loginService.token;
	
	if (token && token.length > 0) {
		const newReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
		return next(newReq);
	} else {
		return next(req);
	}
}