package com.sportstg.PF.modules;

import android.content.Intent;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class MailModule extends ReactContextBaseJavaModule {
  public MailModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "MailModule";
  }

  @ReactMethod
  public void showMailBox() {
    try {
      Intent intent = new Intent(Intent.ACTION_MAIN);
      intent.addCategory(Intent.CATEGORY_APP_EMAIL);
      if(this.getCurrentActivity() == null) {
        return;
      }
      this.getCurrentActivity().startActivity(intent);
    }catch (Exception e){

    }
  }
}
