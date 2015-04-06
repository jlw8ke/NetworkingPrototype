package com.mobiquityinc.nwprototype;

import android.content.Context;

import com.mobiquityinc.nwprototype.rest.RestModule;
import com.squareup.otto.Bus;
import com.squareup.otto.ThreadEnforcer;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import timber.log.Timber;

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

    @Provides
    @Singleton
    Bus provideBus() {
        Bus bus = new Bus(ThreadEnforcer.ANY);
        Timber.i("Created %s:%s", bus, System.identityHashCode(bus));
        return bus;
    }
}
