package com.mobiquityinc.prototype.wwprototype;

import dagger.ObjectGraph;

public interface Injectable {
    void inject(Object object);
    ObjectGraph getObjectGraph();
}
