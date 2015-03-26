package com.mobiquityinc.prototype.wwprototype;

import android.os.Bundle;
import android.support.v7.app.ActionBarActivity;

/**
 * Created by jwashington on 3/26/15.
 */
public abstract class BaseActivity extends ActionBarActivity {

    protected abstract int getLayoutResource();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getLayoutResource());
    }
}
