package com.mobiquityinc.prototype.wwprototype;

import android.content.Context;

import com.mobiquityinc.prototype.wwprototype.rest.RestModule;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;

@Module(
        library = true,
        injects = WWApplication.class,
        includes = RestModule.class
)
public final class AppModule {

    private final WWApplication application;

    public AppModule(WWApplication application) {
        this.application = application;
    }

    @Provides
    @Singleton
    Context provideApplicationContext() {
        return application;
    }
}
