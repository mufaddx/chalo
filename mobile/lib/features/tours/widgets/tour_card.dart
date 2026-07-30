import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../core/models/tour.dart';

class TourCard extends StatelessWidget {
  const TourCard({super.key, required this.tour});

  final Tour tour;

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () => context.push('/tours/${tour.slug}'),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AspectRatio(
              aspectRatio: 16 / 9,
              child: tour.coverImage != null
                  ? CachedNetworkImage(imageUrl: tour.coverImage!, fit: BoxFit.cover)
                  : Container(color: Colors.grey.shade200, child: const Icon(Icons.image, color: Colors.grey)),
            ),
            Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(tour.title, maxLines: 2, overflow: TextOverflow.ellipsis, style: Theme.of(context).textTheme.titleMedium),
                  if (tour.destinationName != null) ...[
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        const Icon(Icons.place_outlined, size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          [tour.destinationName, tour.destinationCountry].whereType<String>().join(', '),
                          style: const TextStyle(color: Colors.grey, fontSize: 12.5),
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Text(
                        '₹${tour.price.toStringAsFixed(0)}',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      if (tour.discountPercent > 0) ...[
                        const SizedBox(width: 6),
                        Text(
                          '₹${tour.originalPrice.toStringAsFixed(0)}',
                          style: const TextStyle(decoration: TextDecoration.lineThrough, color: Colors.grey, fontSize: 12.5),
                        ),
                      ],
                      const Spacer(),
                      const Icon(Icons.star, size: 14, color: Colors.amber),
                      const SizedBox(width: 2),
                      Text(tour.ratingAvg.toStringAsFixed(1), style: const TextStyle(fontSize: 12.5)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
