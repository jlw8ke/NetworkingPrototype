package com.mobiquityinc.prototype.wwprototype;

import org.junit.runners.model.InitializationError;
import org.robolectric.RobolectricGradleTestRunner;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;
import org.robolectric.manifest.AndroidManifest;
import org.robolectric.res.FileFsFile;
import org.robolectric.res.Fs;
import org.robolectric.res.FsFile;

public class CustomTestRunner extends RobolectricGradleTestRunner {

    private static final int MAX_SDK_SUPPORTED_BY_ROBOLECTRIC = 21;

    public CustomTestRunner(Class<?> testClass) throws InitializationError {
        super(testClass);
    }

    @Override
    protected AndroidManifest getAppManifest(Config config) {
        AndroidManifest appManifest = super.getAppManifest(config);
        String moduleRoot = getModuleRootPath(config);

        FsFile androidManifestFile = FileFsFile.from(moduleRoot, appManifest.getAndroidManifestFile().getPath());
        if(!androidManifestFile.exists()) {
            androidManifestFile = FileFsFile.from(moduleRoot,  appManifest.getAndroidManifestFile().getPath().replace("bundles", "manifests/full"));
        }
        FsFile resDirectory = FileFsFile.from(moduleRoot, appManifest.getResDirectory().getPath());
        FsFile assetsDirectory = FileFsFile.from(moduleRoot, appManifest.getAssetsDirectory().getPath());
        AndroidManifest debugManifest = new AndroidManifest(androidManifestFile, resDirectory, assetsDirectory) {
            @Override
            public int getTargetSdkVersion() {
                return MAX_SDK_SUPPORTED_BY_ROBOLECTRIC;
            }

        };
        debugManifest.setPackageName("com.mobiquityinc.prototype.wwprototype.debug");
        return debugManifest;
    }

    private String getModuleRootPath(Config config) {
        String moduleRoot = config.constants().getResource("").toString().replace("file:", "");
        return moduleRoot.substring(0, moduleRoot.indexOf("/build"));
    }



}
