package com.mobiquityinc.prototype.wwprototype.ui;

import android.app.Activity;
import android.content.Context;

import com.mobiquityinc.prototype.wwprototype.AppModule;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import javax.inject.Qualifier;
import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;

@Module(
        library = true,
        addsTo = AppModule.class,
        injects = MainActivity.class
)
public final class UIModule {

    @Qualifier
    @Retention(RetentionPolicy.RUNTIME)
    public @interface ForActivity {}

    private Activity activity;

    UIModule(Activity activity) {
        this.activity = activity;
    }
    @Provides
    @Singleton
    @ForActivity
    Context provideActivityContext() {
        return activity;
    }

}
