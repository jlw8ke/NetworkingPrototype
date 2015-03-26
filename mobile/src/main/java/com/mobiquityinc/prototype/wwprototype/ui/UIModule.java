package com.mobiquityinc.prototype.wwprototype.ui;

import android.app.Activity;

import dagger.Module;

@Module(
        injects = MainActivity.class
)
public final class UIModule {
    private Activity activity;

    UIModule(Activity activity) {
        this.activity = activity;
    }
}
