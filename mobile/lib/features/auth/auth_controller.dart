import 'dart:async';

import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/api/api_client.dart';
import '../../core/models/user.dart';
import 'auth_repository.dart';

enum AuthStatus { guest, authenticated }

class AuthState {
  AuthState({required this.status, this.user});

  final AuthStatus status;
  final User? user;

  bool get isAuthenticated => status == AuthStatus.authenticated;
}

final authControllerProvider = AsyncNotifierProvider<AuthController, AuthState>(AuthController.new);

/// Mirrors frontend/lib/auth/auth-context.tsx: on startup, a stored token is
/// re-validated against GET /auth/me (not just trusted blindly) — any
/// failure, expired token or unreachable backend alike, logs the user out
/// locally rather than leaving the app stuck.
class AuthController extends AsyncNotifier<AuthState> {
  @override
  Future<AuthState> build() async {
    final token = await ref.read(tokenStorageProvider).read();
    if (token == null) {
      return AuthState(status: AuthStatus.guest);
    }

    try {
      final user = await ref.read(authRepositoryProvider).me();
      return AuthState(status: AuthStatus.authenticated, user: user);
    } catch (_) {
      await ref.read(tokenStorageProvider).clear();
      return AuthState(status: AuthStatus.guest);
    }
  }

  Future<User> login(String email, String password, {bool remember = false}) async {
    final result = await ref.read(authRepositoryProvider).login(email, password, remember: remember);
    await ref.read(tokenStorageProvider).write(result.token);
    state = AsyncData(AuthState(status: AuthStatus.authenticated, user: result.user));
    return result.user;
  }

  Future<User> register({
    required String name,
    required String email,
    required String password,
    required String passwordConfirmation,
    String? phone,
  }) async {
    final result = await ref.read(authRepositoryProvider).register(
          name: name,
          email: email,
          password: password,
          passwordConfirmation: passwordConfirmation,
          phone: phone,
        );
    await ref.read(tokenStorageProvider).write(result.token);
    state = AsyncData(AuthState(status: AuthStatus.authenticated, user: result.user));
    return result.user;
  }

  /// Logging out locally always succeeds even if the server call fails
  /// (expired/already-invalid token) — matching the web's "the safe default
  /// either way" behavior in auth-context.tsx.
  Future<void> logout() async {
    try {
      await ref.read(authRepositoryProvider).logout();
    } catch (_) {
      // ignore — still clear the local session below.
    } finally {
      await ref.read(tokenStorageProvider).clear();
      state = AsyncData(AuthState(status: AuthStatus.guest));
    }
  }
}
