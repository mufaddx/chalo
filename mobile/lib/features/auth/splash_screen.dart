import 'package:flutter/material.dart';

/// Shown only while AuthController's initial build() (stored-token check
/// against /auth/me) is still resolving — the router redirects away from
/// here the moment that resolves, so this never needs its own navigation
/// logic.
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.explore, size: 56),
            SizedBox(height: 16),
            CircularProgressIndicator(),
          ],
        ),
      ),
    );
  }
}
