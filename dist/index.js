var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Hapi = require('@hapi/hapi');
const Routes = require('./Routes');
const init = () => __awaiter(this, void 0, void 0, function* () {
    const server = Hapi.Server({
        host: '0.0.0.0',
        port: 8080,
    });
    server.route(Routes);
    yield server.start();
    console.log('Server running at port:', server.info.uri);
});
init();
//# sourceMappingURL=index.js.map