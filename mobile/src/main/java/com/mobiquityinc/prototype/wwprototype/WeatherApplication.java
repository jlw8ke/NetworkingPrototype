package com.mobiquityinc.prototype.wwprototype;

import android.app.Application;

import dagger.ObjectGraph;
import timber.log.Timber;

public class WeatherApplication extends Application implements Injectable {

    private ObjectGraph objectGraph;

    @Override
    public void onCreate() {
        super.onCreate();
        if(BuildConfig.DEBUG) {
            Timber.plant(new Timber.DebugTree());
        }

        objectGraph = ObjectGraph.create(getModules());
        objectGraph.inject(this);
    }

    @Override
    public void inject(Object object) {
        objectGraph.inject(object);
    }

    @Override
    public ObjectGraph getObjectGraph() {
        return objectGraph;
    }

    private Object[] getModules() {
        return new Object[]{
            new AppModule(this)
        };
    }
}
