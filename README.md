## security

All /api/** is permitAll() at the Spring Security filter
GET /api/orders/{id}/payment and GET /api/orders/{id}/facture have no auth or ownership check ✅
Public invoice page /facture/[orderId] ✅
CSRF disabled globally
API registration has weaker password rules than legacy MVC 
File uploads trust Content-Type only; servlet allows 600 MB while service checks 5 MB
Default seeded passwords in code (Abisoft123)

##flow

Forgot password ✅
2FA signup ✅
Remember me
OAuth (Google)

	
Saved addresses API exists but checkout doesn’t use fetchAddresses()
Hardcoded (architecte, notaire, avocat) while SubNav loads from API — can drift ✅
/product?slug= instead of /product/[slug] ✅
Ignores product options (only on detail page) 

Add auth/ownership checks on payment and facture endpoints (token or session + order match)
Add /auth/forgot-password (or remove the link) and wire password reset.✅
Add 2FA code step on signup when the backend requires it. ✅
Remove or implement newsletter, wishlist, share. 

change emails templates design