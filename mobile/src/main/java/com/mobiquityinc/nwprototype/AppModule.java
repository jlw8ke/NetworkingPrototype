package com.mobiquityinc.nwprototype;

import android.content.Context;

import com.mobiquityinc.nwprototype.rest.RestModule;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;

@Module(
        library = true,
        injects = WeatherApplication.class,
        includes = RestModule.class
)
public final class AppModule {

    private final WeatherApplication application;

    public AppModule(WeatherApplication application) {
        this.application = application;
    }

    @Provides
    @Singleton
    Context provideApplicationContext() {
        return application;
    }
}
