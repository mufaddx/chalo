import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/models/user.dart';

class AuthResult {
  AuthResult({required this.user, required this.token});

  final User user;
  final String token;
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(apiClientProvider));
});

/// Mirrors frontend/lib/api/auth.ts — same endpoints, same skipAuth
/// convention, same {user, token} response shape (no `data` wrapper, unlike
/// almost every other endpoint in this backend).
class AuthRepository {
  AuthRepository(this._client);

  final ApiClient _client;

  Future<AuthResult> login(String email, String password, {bool remember = false}) async {
    final json = await _client.post(
      '/auth/login',
      body: {'email': email, 'password': password, 'remember': remember},
      skipAuth: true,
    ) as Map<String, dynamic>;

    return AuthResult(user: User.fromJson(json['user'] as Map<String, dynamic>), token: json['token'] as String);
  }

  Future<AuthResult> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? phone,
  }) async {
    final json = await _client.post(
      '/auth/register',
      body: {
        'name': name,
        'email': email,
        'password': password,
        'password_confirmation': passwordConfirmation,
        if (phone != null && phone.isNotEmpty) 'phone': phone,
      },
      skipAuth: true,
    ) as Map<String, dynamic>;

    return AuthResult(user: User.fromJson(json['user'] as Map<String, dynamic>), token: json['token'] as String);
  }

  Future<User> me() async {
    final json = await _client.get('/auth/me') as Map<String, dynamic>;
    return User.fromJson(json);
  }

  Future<void> logout() async {
    await _client.post('/auth/logout');
  }
}
