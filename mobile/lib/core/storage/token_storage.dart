import 'package:flutter_secure_storage/flutter_secure_storage.dart';

/// Bearer-token storage — the mobile equivalent of the web's
/// localStorage["voyagr_auth_token"]. Kept in the OS keystore/keychain
/// instead of SharedPreferences since a leaked Sanctum token is a real
/// account takeover, not just a UX annoyance.
class TokenStorage {
  TokenStorage(this._storage);

  static const _key = 'voyagr_auth_token';

  final FlutterSecureStorage _storage;

  Future<String?> read() => _storage.read(key: _key);

  Future<void> write(String token) => _storage.write(key: _key, value: token);

  Future<void> clear() => _storage.delete(key: _key);
}
