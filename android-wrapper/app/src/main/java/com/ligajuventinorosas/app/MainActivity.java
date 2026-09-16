package com.ligajuventinorosas.app;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private static final String WEB_BUILD = "38-70";
    private static final String BASE_URL = "https://jairofrancog7-star.github.io/Liga_Futbol/";
    private static final int FILE_CHOOSER_REQUEST = 19022;

    private WebView web;
    private String pendingImage;
    private int shareRevision;
    private ValueCallback<Uri[]> filePathCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        web = findViewById(R.id.web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(false);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setCacheMode(WebSettings.LOAD_DEFAULT);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);

        // Puente mínimo y seguro para que la misma interfaz verde pueda saber
        // cuándo se ejecuta dentro del APK y reutilizar las funciones web/PWA.
        web.addJavascriptInterface(new NativeBridge(), "LigaAndroid");

        web.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                view.evaluateJavascript(
                    "document.documentElement.dataset.jrRuntime='apk';" +
                    "window.dispatchEvent(new CustomEvent('jr:native-ready',{detail:{mode:'apk',build:'" + WEB_BUILD + "'}}));",
                    null
                );

                Uri u = Uri.parse(url);
                if (pendingImage != null && "https".equals(u.getScheme()) &&
                    "jairofrancog7-star.github.io".equals(u.getHost()) &&
                    "/Liga_Futbol/publicaciones.html".equals(u.getPath())) {
                    String value = pendingImage;
                    pendingImage = null;
                    view.evaluateJavascript("window.JRReceiveImage && window.JRReceiveImage(" + org.json.JSONObject.quote(value) + ")", null);
                }
            }

            private boolean openExternal(Uri uri) {
                String host = uri.getHost();
                if (host == null) return false;
                boolean sameSite = host.equals("jairofrancog7-star.github.io");
                if (sameSite) return false;
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                    return true;
                } catch (ActivityNotFoundException e) {
                    return false;
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return openExternal(request.getUrl());
            }

            @Override
            @SuppressWarnings("deprecation")
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                try {
                    return openExternal(Uri.parse(url));
                } catch (Exception e) {
                    return false;
                }
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(
                    WebView webView,
                    ValueCallback<Uri[]> filePathCallbackNew,
                    FileChooserParams fileChooserParams) {

                if (filePathCallback != null) {
                    filePathCallback.onReceiveValue(null);
                }
                filePathCallback = filePathCallbackNew;

                Intent intent;
                try {
                    intent = fileChooserParams.createIntent();
                    intent.setType("image/*");
                    intent.addCategory(Intent.CATEGORY_OPENABLE);
                    startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                    return true;
                } catch (ActivityNotFoundException e) {
                    filePathCallback = null;
                    return false;
                }
            }
        });

        SharedPreferences prefs = getSharedPreferences("jr_mobile_sync", MODE_PRIVATE);
        String previousBuild = prefs.getString("web_build", "");
        if (!WEB_BUILD.equals(previousBuild)) {
            web.clearCache(true);
            web.clearHistory();
            prefs.edit().putString("web_build", WEB_BUILD).apply();
        }

        if (savedInstanceState == null) {
            if (!receiveSharedImage(getIntent())) web.loadUrl(BASE_URL + "?app=android&build=" + WEB_BUILD);
        } else {
            web.restoreState(savedInstanceState);
        }
    }

    private final class NativeBridge {
        @JavascriptInterface
        public String getMode() {
            return "apk";
        }

        @JavascriptInterface
        public String getBuild() {
            return WEB_BUILD;
        }

        @JavascriptInterface
        public void openBrowser(String url) {
            runOnUiThread(() -> {
                try {
                    Uri uri = Uri.parse(url);
                    String scheme = uri.getScheme();
                    if (!("https".equalsIgnoreCase(scheme) || "http".equalsIgnoreCase(scheme))) return;
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception ignored) {
                }
            });
        }

        @JavascriptInterface
        public void shareText(String text) {
            final String safeText = text == null ? "" : text;
            runOnUiThread(() -> {
                try {
                    Intent send = new Intent(Intent.ACTION_SEND);
                    send.setType("text/plain");
                    send.putExtra(Intent.EXTRA_TEXT, safeText);
                    startActivity(Intent.createChooser(send, "Compartir Liga Juventino Rosas"));
                } catch (Exception ignored) {
                }
            });
        }
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        receiveSharedImage(intent);
    }

    @SuppressWarnings("deprecation")
    private boolean receiveSharedImage(Intent intent) {
        if (!Intent.ACTION_SEND.equals(intent.getAction())) return false;
        Uri image = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        String mime = intent.getType();
        if (image == null || !"content".equals(image.getScheme()) ||
            !("image/jpeg".equals(mime) || "image/png".equals(mime) || "image/webp".equals(mime))) return false;
        final int request = ++shareRevision;
        new Thread(() -> {
            try (java.io.InputStream in = getContentResolver().openInputStream(image);
                 java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream()) {
                if (in == null) throw new java.io.IOException();
                byte[] buffer = new byte[8192];
                int read;
                while ((read = in.read(buffer)) != -1) {
                    if (out.size() + read > 10 * 1024 * 1024) throw new java.io.IOException("size");
                    out.write(buffer, 0, read);
                }
                String data = "data:" + mime + ";base64," + android.util.Base64.encodeToString(out.toByteArray(), android.util.Base64.NO_WRAP);
                runOnUiThread(() -> {
                    if (isDestroyed() || request != shareRevision) return;
                    pendingImage = data;
                    web.loadUrl(BASE_URL + "publicaciones.html?mode=credential&app=android&build=" + WEB_BUILD + "#registro");
                });
            } catch (Exception error) {
                runOnUiThread(() -> {
                    if (isDestroyed() || request != shareRevision) return;
                    android.widget.Toast.makeText(this, "No se pudo abrir la imagen. Usa JPG, PNG o WebP de hasta 10 MB.", android.widget.Toast.LENGTH_LONG).show();
                    web.loadUrl(BASE_URL + "publicaciones.html?mode=credential&build=" + WEB_BUILD);
                });
            }
        }).start();
        return true;
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (web != null) web.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == FILE_CHOOSER_REQUEST) {
            if (filePathCallback != null) {
                Uri[] result = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                filePathCallback.onReceiveValue(result);
                filePathCallback = null;
            }
            return;
        }
        super.onActivityResult(requestCode, resultCode, data);
    }

    @Override
    public void onBackPressed() {
        if (web != null && web.canGoBack()) {
            web.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onPause() {
        if (web != null) web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) web.onResume();
    }

    @Override
    protected void onDestroy() {
        if (filePathCallback != null) {
            filePathCallback.onReceiveValue(null);
            filePathCallback = null;
        }
        if (web != null) {
            web.stopLoading();
            web.destroy();
        }
        super.onDestroy();
    }
}
