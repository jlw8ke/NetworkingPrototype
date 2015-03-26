package com.mobiquityinc.prototype.wwprototype.ui;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;

import com.mobiquityinc.prototype.wwprototype.Injectable;
import com.mobiquityinc.prototype.wwprototype.Injector;

import butterknife.ButterKnife;
import dagger.ObjectGraph;

/**
 * Created by jwashington on 3/26/15.
 */
public abstract class BaseActivity extends ActionBarActivity implements Injectable{

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
