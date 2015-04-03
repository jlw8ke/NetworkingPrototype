package com.mobiquityinc.nwprototype;

import android.content.Context;

import timber.log.Timber;

public final class Injector {

    private Injector(){}

    public static boolean inject(Context context, Object object) {
        if(context instanceof Injectable) {
            ((Injectable) context).inject(object);
            return true;
        } else {
            Timber.e("%s cannot be injected because %s does not implement Injectable",
                    object.getClass().getSimpleName(),
                    context);
            return false;
        }
    }


}
