# visualise_blood_pressure

## How to build Android APK
- To sign the app: 
Edit `flutter_app/android/key.properties.txt` and rename it to `key.properties`

- Just in case you need, we built the APK in this env:

```bash
flutter doctor -v             

[✓] Flutter (Channel stable, 3.24.5, on Debian GNU/Linux 12 (bookworm) 6.1.0-28-amd64, locale en_US.UTF-8)
    • Flutter version 3.24.5 on channel stable at /home/u/development/flutter
    • Upstream repository https://github.com/flutter/flutter.git
    • Framework revision dec2ee5c1f (3 weeks ago), 2024-11-13 11:13:06 -0800
    • Engine revision a18df97ca5
    • Dart version 3.5.4
    • DevTools version 2.37.3

[✓] Android toolchain - develop for Android devices (Android SDK version 35.0.0)
    • Android SDK at /home/u/Android/Sdk
    • Platform android-35, build-tools 35.0.0
    • ANDROID_SDK_ROOT = /home/u/Android/Sdk
    • Java binary at: /usr/local/android-studio/jbr/bin/java
    • Java version OpenJDK Runtime Environment (build 21.0.3+-12282718-b509.11)
    • All Android licenses accepted.

[✓] Chrome - develop for the web
    • Chrome at google-chrome

[✓] Linux toolchain - develop for Linux desktop
    • Debian clang version 14.0.6
    • cmake version 3.25.1
    • ninja version 1.11.1
    • pkg-config version 1.8.1

[✓] Android Studio (version 2024.2)
    • Android Studio at /usr/local/android-studio
    • Flutter plugin version 82.1.3
    • Dart plugin can be installed from:
      🔨 https://plugins.jetbrains.com/plugin/6351-dart
    • Java version OpenJDK Runtime Environment (build 21.0.3+-12282718-b509.11)

[✓] IntelliJ IDEA Community Edition (version 2024.2)
    • IntelliJ at /opt/idea-IC-242.23339.11
    • Flutter plugin can be installed from:
      🔨 https://plugins.jetbrains.com/plugin/9212-flutter
    • Dart plugin can be installed from:
      🔨 https://plugins.jetbrains.com/plugin/6351-dart

[✓] VS Code (version 1.95.3)
    • VS Code at /usr/share/code
    • Flutter extension version 3.100.0

[✓] Connected device (2 available)
    • Linux (desktop) • linux  • linux-x64      • Debian GNU/Linux 12 (bookworm) 6.1.0-28-amd64
    • Chrome (web)    • chrome • web-javascript • Google Chrome 131.0.6778.85

[✓] Network resources
    • All expected network resources are available.

• No issues found!


```