import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';

Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
    SystemChrome.setEnabledSystemUIMode(SystemUiMode.immersiveSticky);

  runApp(const MaterialApp(
    debugShowCheckedModeBanner: false,
    home: WebViewApp(),
  ));
}

class WebViewApp extends StatefulWidget {
  const WebViewApp({super.key});

  @override
  State<WebViewApp> createState() => _WebViewAppState();
}

class _WebViewAppState extends State<WebViewApp> {
  final GlobalKey webViewKey = GlobalKey();
  InAppWebViewController? _webViewController;
  bool _canGoBack = false;

  InAppWebViewSettings settings = InAppWebViewSettings(
    useHybridComposition: false,
    allowFileAccessFromFileURLs: false,
    allowUniversalAccessFromFileURLs: false,
    allowFileAccess: false,
    allowContentAccess: false,
    webViewAssetLoader: WebViewAssetLoader(
      domain: "cuong.eu.org", // Replace with your desired domain
      pathHandlers: [AssetsPathHandler(path: '/assets/')],
    ),
  );

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: _canGoBack, // Determine if we can go back
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) {
          return; // If the default pop action already happened, do nothing
        }
        if (_canGoBack) {
          await _webViewController?.goBack(); // Go back in the WebView
        }
      },
      child: Scaffold(
        body: InAppWebView(
          key: webViewKey,
          initialUrlRequest: URLRequest(
            url: WebUri(
                "https://cuong.eu.org/assets/flutter_assets/assets/docs/index.html"),
          ),
          initialSettings: settings,
          onWebViewCreated: (controller) {
            _webViewController = controller;
          },
          onLoadStop: (controller, url) async {
            final canGoBack = await controller.canGoBack();
            setState(() {
              _canGoBack = canGoBack;
            });
          },
        ),
      ),
    );
  }
}
