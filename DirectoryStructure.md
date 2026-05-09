# IT342 QuickClinic - Directory Structure

```
IT342-Villarta-QuickClinic/
├── Copilot_Mobile_Fragments.md
├── DirectoryStructure.md
├── README.md
├── backend/
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── pom.xml
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── edu/
│   │   │   │       └── cit/
│   │   │   │           └── villarta/
│   │   │   │               └── quickclinic/
│   │   │   │                   ├── controller/
│   │   │   │                   ├── service/
│   │   │   │                   ├── repository/
│   │   │   │                   ├── model/
│   │   │   │                   ├── config/
│   │   │   │                   └── QuickclinicApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   │       └── java/
│   │           └── edu/
│   │               └── cit/
│   │                   └── villarta/
│   │                       └── quickclinic/
│   │                           └── QuickclinicApplicationTests.java
│   └── target/
│       ├── classes/
│       │   ├── application.properties
│       │   └── edu/
│       │       └── cit/
│       │           └── villarta/
│       │               └── quickclinic/
│       ├── generated-sources/
│       │   └── annotations/
│       ├── generated-test-sources/
│       │   └── test-annotations/
│       ├── maven-status/
│       │   └── maven-compiler-plugin/
│       │       ├── compile/
│       │       └── testCompile/
│       ├── surefire-reports/
│       │   ├── edu.cit.villarta.quickclinic.QuickclinicApplicationTests.txt
│       │   └── TEST-edu.cit.villarta.quickclinic.QuickclinicApplicationTests.xml
│       └── test-classes/
│           └── edu/
│               └── cit/
│                   └── villarta/
│                       └── quickclinic/
├── frontend/
│   ├── package.json
│   ├── README.md
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── components/
│       │   ├── Button.js
│       │   ├── Input.js
│       │   ├── Layout.js
│       │   └── PrivateRoute.js
│       ├── pages/
│       │   ├── AppointmentHistory.js
│       │   ├── BookAppointment.js
│       │   ├── Dashboard.js
│       │   ├── Login.js
│       │   ├── Profile.js
│       │   ├── Register.js
│       │   └── StudentDashboard.js
│       ├── services/
│       │   └── api.js
│       ├── styles/
│       │   └── GlobalStyles.js
│       └── utils/
│           └── token.js
└── mobile/
    ├── build.gradle.kts
    ├── gradle.properties
    ├── gradlew
    ├── gradlew.bat
    ├── settings.gradle.kts
    ├── app/
    │   ├── build.gradle.kts
    │   ├── proguard-rules.pro
    │   ├── build/
    │   │   └── tmp/
    │   │       ├── allTests/
    │   │       ├── analyzeDebugAndroidTestDependencies/
    │   │       ├── analyzeDebugDependencies/
    │   │       ├── analyzeDebugUnitTestDependencies/
    │   │       ├── analyzeReleaseDependencies/
    │   │       ├── analyzeReleaseUnitTestDependencies/
    │   │       ├── androidDependencies/
    │   │       ├── asarToCompatSplitsForDebug/
    │   │       ├── asarToCompatSplitsForRelease/
    │   │       ├── assemble/
    │   │       ├── assembleAndroidTest/
    │   │       ├── assembleDebug/
    │   │       ├── assembleDebugAndroidTest/
    │   │       └── assembleDebugUnitTest/
    │   └── src/
    │       ├── androidTest/
    │       │   └── java/
    │       ├── main/
    │       │   ├── AndroidManifest.xml
    │       │   ├── java/
    │       │   │   └── com/
    │       │   │       └── quickclinic/
    │       │   └── res/
    │       │       ├── drawable/
    │       │       ├── layout/
    │       │       ├── values/
    │       │       └── mipmap/
    │       └── test/
    │           └── java/
    ├── gradle/
    │   ├── libs.versions.toml
    │   └── wrapper/
    │       └── gradle-wrapper.properties
    └── build/
        └── tmp/
            ├── buildEnvironment/
            ├── components/
            ├── dependencies/
            ├── dependencyInsight/
            ├── dependentComponents/
            ├── help/
            ├── init/
            ├── javaToolchains/
            ├── kotlinDslAccessorsReport/
            ├── model/
            ├── outgoingVariants/
            ├── prepareKotlinBuildScriptModel/
            ├── projects/
            ├── properties/
            ├── resolvableConfigurations/
            ├── tasks/
            └── wrapper/
```

## Project Overview

This project is divided into three main sections:

### **Backend** (Java Spring Boot)
- REST API built with Spring Boot
- Maven project structure
- Database integration and services
- Located in `/backend`

### **Frontend** (React.js)
- React-based web application
- Components for UI (Button, Input, Layout)
- Pages for different user interactions (Login, Register, Dashboard, Appointments)
- API integration through services
- Located in `/frontend`

### **Mobile** (Android)
- Android native application
- Gradle-based build system
- Located in `/mobile`
