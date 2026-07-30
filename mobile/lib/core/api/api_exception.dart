/// Mirrors frontend/lib/api/client.ts's ApiError: a single exception type
/// for every failure mode, with `status == 0` meaning "never reached the
/// server" (the Dio equivalent of a bare TypeError from fetch()).
class ApiException implements Exception {
  ApiException(this.message, this.status, [this.errors]);

  factory ApiException.network() => ApiException(
        "Can't reach the Voyagr API. Check your connection and try again.",
        0,
      );

  final String message;
  final int status;

  /// Laravel's validation-exception field errors, e.g. {"email": ["..."]}.
  final Map<String, List<String>>? errors;

  bool get isNetworkError => status == 0;

  @override
  String toString() => message;
}
