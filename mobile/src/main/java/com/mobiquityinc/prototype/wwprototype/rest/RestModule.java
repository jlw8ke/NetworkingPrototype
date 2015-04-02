package com.mobiquityinc.prototype.wwprototype.rest;

import android.content.Context;

import com.mobiquityinc.prototype.wwprototype.R;
import com.squareup.okhttp.OkHttpClient;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import retrofit.RestAdapter;
import retrofit.client.Client;
import retrofit.client.OkClient;

@Module(
        complete = false,
        library = true
)
public final class RestModule {


    @Provides
    @Singleton
    RestAdapter provideRestAdapter(Context context, Client client) {
        RestAdapter restAdapter = new RestAdapter.Builder()
                .setEndpoint(context.getString(R.string.weather_service_url))
                .setClient(client)
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .build();

        return restAdapter;
    }

    @Provides
    @Singleton
    OkHttpClient provideOkHttpClient() {
        OkHttpClient client = new OkHttpClient();
        return client;
    }

    @Provides
    @Singleton
    Client provideClient(OkHttpClient client) {
        return new OkClient(client);
    }
}
