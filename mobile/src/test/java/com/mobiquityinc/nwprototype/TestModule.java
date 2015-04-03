package com.mobiquityinc.nwprototype;

import com.mobiquityinc.nwprototype.ui.MainActivity;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import javax.inject.Qualifier;

import dagger.Module;
import dagger.Provides;
import retrofit.client.Client;

@Module(
        library = true,
        complete = false,
        injects = MainActivity.class
)
public final class TestModule {

    @Qualifier
    @Retention(RetentionPolicy.RUNTIME)
    public @interface Mock {}

    @Provides
    @TestModule.Mock
    public Client provideMockClient() {
        return null;
    }

}
