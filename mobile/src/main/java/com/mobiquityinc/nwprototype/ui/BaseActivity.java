package com.mobiquityinc.nwprototype.ui;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;


import com.mobiquityinc.nwprototype.Injectable;
import com.mobiquityinc.nwprototype.Injector;
import com.squareup.otto.Bus;

import javax.inject.Inject;

import butterknife.ButterKnife;
import dagger.ObjectGraph;

/**
 * Created by jwashington on 3/26/15.
 */
public abstract class BaseActivity extends ActionBarActivity implements Injectable {

    @Inject Bus eventBus;

    private ObjectGraph scopedGraph;

    protected abstract int getLayoutResource();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Injector.inject(this, this);

        super.onCreate(savedInstanceState);
        setContentView(getLayoutResource());
        ButterKnife.inject(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        eventBus.register(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        eventBus.unregister(this);
    }

    @Override
    public final void inject(Object object) {
        scopedGraph = ((Injectable)getApplicationContext()).getObjectGraph().plus(getScopedModules());
        scopedGraph.inject(object);
    }

    @Override
    public final ObjectGraph getObjectGraph() {
        return scopedGraph;
    }

    private Object[] getScopedModules() {
        return new Object[]{
                new UIModule(this)
        };
    }

}
