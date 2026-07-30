/// Mirrors AuthController's User JSON — same fields whether it comes back
/// from /auth/register, /auth/login, or /auth/me. A Voyagr customer app
/// only ever sees role == "customer" (register/Google login force it).
class User {
  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.phone,
    this.avatarPath,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] as int,
      name: json['name'] as String,
      email: json['email'] as String,
      role: json['role'] as String,
      phone: json['phone'] as String?,
      avatarPath: json['avatar_path'] as String?,
    );
  }

  final int id;
  final String name;
  final String email;
  final String role;
  final String? phone;
  final String? avatarPath;
}
