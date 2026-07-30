import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../shared/widgets/main_bottom_nav.dart';
import '../auth/auth_controller.dart';

/// Read-only account info + logout. No edit-profile form: the backend has
/// no update-profile endpoint, and a "Save" button that silently does
/// nothing (as the web dashboard's mock profile form does today) is worse
/// than not offering editing at all.
class AccountScreen extends ConsumerWidget {
  const AccountScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authControllerProvider).valueOrNull;
    final user = authState?.user;

    return Scaffold(
      appBar: AppBar(title: const Text('Account')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          CircleAvatar(radius: 32, child: Text(user?.name.isNotEmpty == true ? user!.name[0].toUpperCase() : '?')),
          const SizedBox(height: 12),
          Text(user?.name ?? '—', style: Theme.of(context).textTheme.titleLarge),
          Text(user?.email ?? '—', style: const TextStyle(color: Colors.grey)),
          if (user?.phone != null) Text(user!.phone!, style: const TextStyle(color: Colors.grey)),
          const SizedBox(height: 24),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.receipt_long_outlined),
            title: const Text('My Bookings'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => context.push('/bookings'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Log out', style: TextStyle(color: Colors.red)),
            onTap: () async {
              await ref.read(authControllerProvider.notifier).logout();
              if (context.mounted) context.go('/login');
            },
          ),
        ],
      ),
      bottomNavigationBar: const MainBottomNav(currentIndex: 3),
    );
  }
}
