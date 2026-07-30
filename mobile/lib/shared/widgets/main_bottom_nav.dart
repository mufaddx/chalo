import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

/// Shared bottom nav embedded by each of the four top-level screens
/// (Home/Search/My Bookings/Account) — they're independent routes, not tabs
/// inside one shell, so each screen passes its own index and navigates via
/// `context.go` (replacing the stack) when another tab is tapped.
class MainBottomNav extends StatelessWidget {
  const MainBottomNav({super.key, required this.currentIndex});

  final int currentIndex;

  static const _routes = ['/home', '/search', '/bookings', '/account'];

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      selectedIndex: currentIndex,
      onDestinationSelected: (i) {
        if (i != currentIndex) context.go(_routes[i]);
      },
      destinations: const [
        NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Home'),
        NavigationDestination(icon: Icon(Icons.search_outlined), selectedIcon: Icon(Icons.search), label: 'Search'),
        NavigationDestination(icon: Icon(Icons.receipt_long_outlined), selectedIcon: Icon(Icons.receipt_long), label: 'Bookings'),
        NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Account'),
      ],
    );
  }
}
