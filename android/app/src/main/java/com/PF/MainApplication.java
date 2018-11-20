package com.PF;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import org.reactnative.camera.RNCameraPackage;

import io.invertase.firebase.RNFirebasePackage;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;


import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;

//import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.database.RNFirebaseDatabasePackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.functions.RNFirebaseFunctionsPackage;


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RNFusedLocationPackage(),
            new RNCameraPackage(),
                    new RNFirebasePackage(),
                    new RNI18nPackage(),
                    new VectorIconsPackage(),
                    new RCTSplashScreenPackage(),
                    new RNFirebaseAuthPackage(),
                    new RNFirebaseDatabasePackage(),
                    new RNFirebaseFirestorePackage(),
                    new RNFirebaseNotificationsPackage(),
                    new RNFirebaseMessagingPackage(),
                    new RNFirebaseCrashlyticsPackage(),
                    new RNFirebaseFunctionsPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
