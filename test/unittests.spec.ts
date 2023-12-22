import {URIContexts, URIResolver} from "../src/lib/URIContexts";
import {TokenUtil} from "../src/lib/TokenUtil";

describe('test URIResolver', function () {

    it("should parse", () => {
        process.env["uri.threads.likes"] = "private/api/v1/threads/%0%/likes";

        const uriResolved = URIResolver(URIContexts.LIKE_THREAD,1234);
        expect(uriResolved).toBe("private/api/v1/threads/1234/likes/");
    })

    it('should validate a cognito token has expired', function () {
        expect(TokenUtil.hasExpired("eyJraWQiOiIwVTNDV29TbFJPSVcwS2NFVUVOTW1HbXR6Vjdjc1wvVjlVQVJLMDZOK3ZSOD0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiN2Q4ZjZkMS1lNjNiLTRjOGUtYmRlNC04MDc1MWQzZGQ0ZGIiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbiJdLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9uekJqUGw5R3IiLCJ2ZXJzaW9uIjoyLCJjbGllbnRfaWQiOiI3ajVjb2phMWNldW5nOHByZWUzbDQ0ZGZzdSIsIm9yaWdpbl9qdGkiOiIxNzkxOTBmZi1jOGM4LTRkMDMtYjJkNy00MTU2NzQ3YzI4NzciLCJldmVudF9pZCI6IjFhZTAyMGI2LWZmYzgtNDU5Yy1hNDFmLWJlMmY1MmEwYjljMSIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoicGhvbmUgb3BlbmlkIGVtYWlsIiwiYXV0aF90aW1lIjoxNjc2MDY1NTc4LCJleHAiOjE2NzYxNTE5NzgsImlhdCI6MTY3NjA2NTU3OCwianRpIjoiZmRiNzliOWItNjAxOS00MWQ2LWJmY2EtOTExNmM4NTk3NjgwIiwidXNlcm5hbWUiOiJnd2FkZGVsbCJ9.OmcX02lpqvFvOdOcsuGx-IbNo_AzlQYDf-E0J-fn3RNWY2qPHsdLc6j7IQKHfpdelh2M-F3cwEoPfnqTsItcv2y805_FM7u1Bv2ndphs0mE6P2XO-aKOn1Evkptb4IaH9vQdf9XB0rTHQnDccV9-zIfcn4toeJUB-xJ1ASbGvyW6zQ88IfAa0wBSOkbZ6A9_O663pGqML7dBpLfGdtOJPssvV1KRADXNyhGlT6ctuj50l8Ey-6AhX7zj8AxwmHi02QudzSN71lbh6MegOy3_f2NI5Lz6w-BZtvsbXtOV2yEqRmQrmn7BlmXVhUlCdyon-AoZAx2GNlG6bnL5e_oO2g")).toBeTruthy();
    });


});