package com.mobiquityinc.nwprototype;

import dagger.ObjectGraph;

public interface Injectable {
    void inject(Object object);
    ObjectGraph getObjectGraph();
}
