import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../storage/token_storage.dart';
import 'api_exception.dart';

/// Mirrors frontend/lib/api/config.ts's NEXT_PUBLIC_API_URL: override at
/// build/run time with `--dart-define=API_BASE_URL=http://192.168.x.x:8000/api`.
/// The default targets the Android emulator's loopback to the host machine;
/// it will NOT work on a physical device or iOS simulator without overriding it.
const _defaultBaseUrl = 'http://10.0.2.2:8000/api';
const apiBaseUrl = String.fromEnvironment('API_BASE_URL', defaultValue: _defaultBaseUrl);

final tokenStorageProvider = Provider<TokenStorage>((ref) {
  return TokenStorage(const FlutterSecureStorage());
});

final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(ref.watch(tokenStorageProvider));
});

/// Thin wrapper around Dio mirroring frontend/lib/api/client.ts's `api`
/// object: same skipAuth convention, same single-exception-type error
/// handling, same "status 0 means never reached the server" signal.
class ApiClient {
  ApiClient(this._tokenStorage) : _dio = Dio(BaseOptions(baseUrl: apiBaseUrl)) {
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final skipAuth = options.extra['skipAuth'] == true;
          if (!skipAuth) {
            final token = await _tokenStorage.read();
            if (token != null) {
              options.headers['Authorization'] = 'Bearer $token';
            }
          }
          options.headers['Accept'] = 'application/json';
          handler.next(options);
        },
      ),
    );
  }

  final Dio _dio;
  final TokenStorage _tokenStorage;

  Future<dynamic> get(String path, {Map<String, dynamic>? query, bool skipAuth = false}) {
    return _request(() => _dio.get(path, queryParameters: query, options: Options(extra: {'skipAuth': skipAuth})));
  }

  Future<dynamic> post(String path, {Object? body, bool skipAuth = false}) {
    return _request(() => _dio.post(path, data: body, options: Options(extra: {'skipAuth': skipAuth})));
  }

  Future<dynamic> patch(String path, {Object? body, bool skipAuth = false}) {
    return _request(() => _dio.patch(path, data: body, options: Options(extra: {'skipAuth': skipAuth})));
  }

  Future<dynamic> delete(String path, {bool skipAuth = false}) {
    return _request(() => _dio.delete(path, options: Options(extra: {'skipAuth': skipAuth})));
  }

  Future<dynamic> _request(Future<Response> Function() call) async {
    try {
      final response = await call();
      return response.data;
    } on DioException catch (e) {
      if (e.type == DioExceptionType.connectionError ||
          e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.unknown) {
        throw ApiException.network();
      }

      final data = e.response?.data;
      final message = (data is Map && data['message'] is String)
          ? data['message'] as String
          : 'Request failed with status ${e.response?.statusCode ?? 0}';
      final rawErrors = data is Map ? data['errors'] : null;
      final errors = rawErrors is Map
          ? rawErrors.map((key, value) => MapEntry(key.toString(), List<String>.from(value as List)))
          : null;

      throw ApiException(message, e.response?.statusCode ?? 0, errors);
    }
  }
}
